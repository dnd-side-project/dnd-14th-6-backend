import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '@users/application/users.service';

import { GameDifficultyMode } from '../domain/game.business-rules';
import { GameSessionService } from './game-session.service';
import { GameFacade } from './game.facade';
import { GamesService } from './games.service';

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
  });
});
