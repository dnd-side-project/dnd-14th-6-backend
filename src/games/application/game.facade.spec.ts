import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '@users/application/users.service';

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
    Pick<GameSessionService, 'createGameSession' | 'getTotalScoreByUserId'>
  >;
  let usersService: jest.Mocked<Pick<UsersService, 'updateTotalScore'>>;

  beforeEach(async () => {
    const mockGamesService = {};

    const mockGameSessionService = {
      createGameSession: jest.fn(),
      getTotalScoreByUserId: jest.fn(),
    };

    const mockUsersService = {
      updateTotalScore: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameFacade,
        { provide: GamesService, useValue: mockGamesService },
        { provide: GameSessionService, useValue: mockGameSessionService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    facade = module.get<GameFacade>(GameFacade);
    gameSessionService = module.get(GameSessionService);
    usersService = module.get(UsersService);
  });

  describe('saveGameSession', () => {
    const baseDto = {
      categoryId: 1,
      difficultyMode: GameDifficultyMode.Easy,
      score: 10,
      clientAnswers: [],
    };

    describe('✅ 성공 케이스', () => {
      it('회원인 경우 게임 세션 저장 후 totalScore를 갱신하고 gameSessionId와 totalScore를 반환한다.', async () => {
        const userId = 1n;
        const gameSessionId = 100n;
        const totalScore = 150n;

        gameSessionService.createGameSession.mockResolvedValue(gameSessionId);
        gameSessionService.getTotalScoreByUserId.mockResolvedValue(totalScore);
        usersService.updateTotalScore.mockResolvedValue(undefined);

        const result = await facade.saveGameSession({ ...baseDto, userId });

        expect(result.gameSessionId).toBe(gameSessionId);
        expect(result.totalScore).toBe(totalScore);

        expect(gameSessionService.createGameSession).toHaveBeenCalledWith(
          expect.objectContaining({ userId }),
        );
        expect(gameSessionService.getTotalScoreByUserId).toHaveBeenCalledWith(userId);
        expect(usersService.updateTotalScore).toHaveBeenCalledWith(userId, totalScore);
      });

      it('비회원인 경우 게임 세션만 저장하고 totalScore 관련 로직을 수행하지 않으며 totalScore는 undefined로 반환한다.', async () => {
        const gameSessionId = 200n;

        gameSessionService.createGameSession.mockResolvedValue(gameSessionId);

        const result = await facade.saveGameSession(baseDto);

        expect(result.gameSessionId).toBe(gameSessionId);
        expect(result.totalScore).toBeUndefined();

        expect(gameSessionService.getTotalScoreByUserId).not.toHaveBeenCalled();
        expect(usersService.updateTotalScore).not.toHaveBeenCalled();
      });
    });

    describe('❌ 실패 케이스 - 트랜잭션 원자성 (에러 전파로 @Transactional 롤백 유도)', () => {
      const userId = 1n;

      it('createGameSession 실패 시 게임 세션이 저장되지 않고, totalScore 갱신도 수행되지 않는다.', async () => {
        gameSessionService.createGameSession.mockRejectedValue(new Error('게임 세션 저장 실패'));

        await expect(facade.saveGameSession({ ...baseDto, userId })).rejects.toThrow(
          '게임 세션 저장 실패',
        );

        // 게임 세션 저장 자체가 실패했으므로 후속 작업이 실행되지 않아야 한다
        expect(gameSessionService.getTotalScoreByUserId).not.toHaveBeenCalled();
        expect(usersService.updateTotalScore).not.toHaveBeenCalled();
      });

      it('updateTotalScore 실패 시 에러가 전파되어 게임 세션 저장도 롤백되고, user의 totalScore는 변경되지 않는다.', async () => {
        const previousTotalScore = 100n;

        gameSessionService.createGameSession.mockResolvedValue(100n);
        gameSessionService.getTotalScoreByUserId.mockResolvedValue(previousTotalScore);
        usersService.updateTotalScore.mockRejectedValue(new Error('총 점수 업데이트 실패'));

        await expect(facade.saveGameSession({ ...baseDto, userId })).rejects.toThrow(
          '총 점수 업데이트 실패',
        );

        // 에러가 전파되어 @Transactional에 의해 트랜잭션 전체가 롤백된다
        // → createGameSession으로 저장된 게임 세션도 롤백
        // → updateTotalScore가 실패했으므로 user.totalScore는 이전 값(previousTotalScore) 그대로 유지
        expect(gameSessionService.createGameSession).toHaveBeenCalled();
        expect(gameSessionService.getTotalScoreByUserId).toHaveBeenCalledWith(userId);
        expect(usersService.updateTotalScore).toHaveBeenCalledWith(userId, previousTotalScore);
      });
    });
  });
});
