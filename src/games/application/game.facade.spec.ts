import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TiersService } from '@tiers/application/tiers.service';
import { Tier } from '@tiers/domain/tiers.entity';
import { UsersService } from '@users/application/users.service';
import { IncrementTotalScoreMapper } from '@users/domain/increment-total-score.mapper';

import { GameDifficultyMode } from '../domain/game.business-rules';
import { GameSessionService } from './game-session.service';
import { GameFacade } from './game.facade';
import { GamesService } from './games.service';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
    descriptor,
}));

describe('GameFacade', () => {
  let facade: GameFacade;
  let gameSessionService: jest.Mocked<
    Pick<GameSessionService, 'createGameSession' | 'validateAndCalculateScore'>
  >;
  let usersService: jest.Mocked<Pick<UsersService, 'incrementTotalScore' | 'updateTierId'>>;
  let tiersService: jest.Mocked<Pick<TiersService, 'findTierByUserTotalScore'>>;

  beforeEach(async () => {
    const mockGamesService = {};

    const mockGameSessionService = {
      createGameSession: jest.fn(),
      validateAndCalculateScore: jest.fn(),
    };

    const mockUsersService = {
      incrementTotalScore: jest.fn(),
      updateTierId: jest.fn(),
    };

    const mockTiersService = {
      findTierByUserTotalScore: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameFacade,
        { provide: GamesService, useValue: mockGamesService },
        { provide: GameSessionService, useValue: mockGameSessionService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: TiersService, useValue: mockTiersService },
      ],
    }).compile();

    facade = module.get<GameFacade>(GameFacade);
    gameSessionService = module.get(GameSessionService);
    usersService = module.get(UsersService);
    tiersService = module.get(TiersService);
  });

  describe('saveGameSession', () => {
    const baseDto = {
      categoryId: 1,
      difficultyMode: GameDifficultyMode.Easy,
      score: 10,
      clientAnswers: [],
    };

    describe('✅ 성공 케이스', () => {
      it('회원인 경우 기존 티어와 다르면 티어를 승급시킨다.', async () => {
        const userId = 1n;
        const gameSessionId = 100n;
        const serverScore = 10;
        const updatedTotalScore = 150n;
        const currentTierId = 1;
        const newTier = Tier.from({
          id: 2,
          name: 'silver',
          minScore: 100,
          imageUrl: null,
          iconUrl: null,
        });

        gameSessionService.validateAndCalculateScore.mockResolvedValue(serverScore);
        gameSessionService.createGameSession.mockResolvedValue(gameSessionId);
        usersService.incrementTotalScore.mockResolvedValue(
          IncrementTotalScoreMapper.from({ totalScore: updatedTotalScore, tierId: currentTierId }),
        );
        tiersService.findTierByUserTotalScore.mockResolvedValue(newTier);

        const result = await facade.saveGameSession({ ...baseDto, userId });

        expect(result.gameSessionId).toBe(gameSessionId);
        expect(result.totalScore).toBe(updatedTotalScore);

        expect(gameSessionService.validateAndCalculateScore).toHaveBeenCalledWith(
          baseDto.categoryId,
          baseDto.clientAnswers,
        );
        expect(gameSessionService.createGameSession).toHaveBeenCalledWith(
          expect.objectContaining({ userId, score: serverScore }),
        );
        expect(usersService.incrementTotalScore).toHaveBeenCalledWith(userId, BigInt(serverScore));
        expect(tiersService.findTierByUserTotalScore).toHaveBeenCalledWith(updatedTotalScore);
        expect(usersService.updateTierId).toHaveBeenCalledWith(userId, newTier.id);
      });

      it('회원인 경우 기존 티어와 동일하면 updateTierId를 호출하지 않는다.', async () => {
        const userId = 1n;
        const gameSessionId = 100n;
        const serverScore = 10;
        const updatedTotalScore = 150n;
        const sameTier = Tier.from({
          id: 2,
          name: 'silver',
          minScore: 100,
          imageUrl: null,
          iconUrl: null,
        });

        gameSessionService.validateAndCalculateScore.mockResolvedValue(serverScore);
        gameSessionService.createGameSession.mockResolvedValue(gameSessionId);
        usersService.incrementTotalScore.mockResolvedValue(
          IncrementTotalScoreMapper.from({ totalScore: updatedTotalScore, tierId: sameTier.id }),
        );
        tiersService.findTierByUserTotalScore.mockResolvedValue(sameTier);

        const result = await facade.saveGameSession({ ...baseDto, userId });

        expect(result.gameSessionId).toBe(gameSessionId);
        expect(result.totalScore).toBe(updatedTotalScore);

        expect(tiersService.findTierByUserTotalScore).toHaveBeenCalledWith(updatedTotalScore);
        expect(usersService.updateTierId).not.toHaveBeenCalled();
      });

      it('비회원인 경우 게임 세션만 저장하고 totalScore 및 티어 관련 로직을 수행하지 않는다.', async () => {
        const gameSessionId = 200n;
        const serverScore = 10;

        gameSessionService.validateAndCalculateScore.mockResolvedValue(serverScore);
        gameSessionService.createGameSession.mockResolvedValue(gameSessionId);

        const result = await facade.saveGameSession(baseDto);

        expect(result.gameSessionId).toBe(gameSessionId);
        expect(result.totalScore).toBeUndefined();

        expect(usersService.incrementTotalScore).not.toHaveBeenCalled();
        expect(tiersService.findTierByUserTotalScore).not.toHaveBeenCalled();
        expect(usersService.updateTierId).not.toHaveBeenCalled();
      });
    });

    describe('❌ 실패 케이스 - 트랜잭션 원자성 (에러 전파로 @Transactional 롤백 유도)', () => {
      const userId = 1n;

      it('validateAndCalculateScore 실패 시 게임 세션이 저장되지 않고, totalScore 갱신도 수행되지 않는다.', async () => {
        gameSessionService.validateAndCalculateScore.mockRejectedValue(
          new NotFoundException('존재하지 않는 카테고리입니다.'),
        );

        await expect(facade.saveGameSession({ ...baseDto, userId })).rejects.toThrow(
          '존재하지 않는 카테고리입니다.',
        );

        expect(gameSessionService.createGameSession).not.toHaveBeenCalled();
        expect(usersService.incrementTotalScore).not.toHaveBeenCalled();
      });

      it('createGameSession 실패 시 게임 세션이 저장되지 않고, totalScore 갱신도 수행되지 않는다.', async () => {
        gameSessionService.validateAndCalculateScore.mockResolvedValue(10);
        gameSessionService.createGameSession.mockRejectedValue(new Error('게임 세션 저장 실패'));

        await expect(facade.saveGameSession({ ...baseDto, userId })).rejects.toThrow(
          '게임 세션 저장 실패',
        );

        expect(usersService.incrementTotalScore).not.toHaveBeenCalled();
      });

      it('findTierByUserTotalScore에서 NotFoundException이 발생하면 이전 게임 세션 저장과 점수 증분도 롤백된다.', async () => {
        const serverScore = 10;
        const updatedTotalScore = 150n;

        gameSessionService.validateAndCalculateScore.mockResolvedValue(serverScore);
        gameSessionService.createGameSession.mockResolvedValue(100n);
        usersService.incrementTotalScore.mockResolvedValue(
          IncrementTotalScoreMapper.from({ totalScore: updatedTotalScore, tierId: 1 }),
        );
        tiersService.findTierByUserTotalScore.mockRejectedValue(
          new NotFoundException('티어 정보를 찾을 수 없습니다.'),
        );

        await expect(facade.saveGameSession({ ...baseDto, userId })).rejects.toThrow(
          NotFoundException,
        );

        // @Transactional에 의해 트랜잭션 전체가 롤백된다
        // → createGameSession으로 저장된 게임 세션도 롤백
        // → incrementTotalScore로 증분된 totalScore도 롤백
        expect(gameSessionService.createGameSession).toHaveBeenCalled();
        expect(usersService.incrementTotalScore).toHaveBeenCalledWith(userId, BigInt(serverScore));
        expect(tiersService.findTierByUserTotalScore).toHaveBeenCalledWith(updatedTotalScore);
        expect(usersService.updateTierId).not.toHaveBeenCalled();
      });

      it('incrementTotalScore 실패 시 에러가 전파되어 게임 세션 저장도 롤백되고, user의 totalScore는 변경되지 않는다.', async () => {
        const serverScore = 10;

        gameSessionService.validateAndCalculateScore.mockResolvedValue(serverScore);
        gameSessionService.createGameSession.mockResolvedValue(100n);
        usersService.incrementTotalScore.mockRejectedValue(new Error('총 점수 업데이트 실패'));

        await expect(facade.saveGameSession({ ...baseDto, userId })).rejects.toThrow(
          '총 점수 업데이트 실패',
        );

        // 에러가 전파되어 @Transactional에 의해 트랜잭션 전체가 롤백된다
        // → createGameSession으로 저장된 게임 세션도 롤백
        // → incrementTotalScore가 실패했으므로 user.totalScore는 이전 값 그대로 유지
        expect(gameSessionService.createGameSession).toHaveBeenCalled();
        expect(usersService.incrementTotalScore).toHaveBeenCalledWith(userId, BigInt(serverScore));
      });
    });
  });
});
