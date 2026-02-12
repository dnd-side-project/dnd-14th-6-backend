import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from '../application/games.service';
import { GameSessionService } from '../application/game-session.service';
import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
import { DIFFICULTY_MODES, GameSessionSortBy, SortOrder } from '../domain/game.business-rules';
import { GetGameOptionsResponseDto } from './dto/get-game-options.dto';
import {
  GetGameHistoriesQueryDto,
  GetGameHistoriesResponseDto,
} from './dto/get-game-histories.dto';

describe('GamesController', () => {
  let controller: GamesController;
  let gameService: jest.Mocked<GamesService>;
  let gameSessionService: jest.Mocked<GameSessionService>;

  beforeEach(async () => {
    const mockGameService = {
      getGameOptions: jest.fn(),
    };

    const mockGameSessionService = {
      getSessionHistories: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGameService,
        },
        {
          provide: GameSessionService,
          useValue: mockGameSessionService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gameService = module.get(GamesService);
    gameSessionService = module.get(GameSessionService);
  });

  describe('getGameOptions', () => {
    it('게임옵션 정보를 정상적으로 응답한다.', async () => {
      const categories: GameCategory[] = [
        { id: 1, name: 'Git' },
        { id: 2, name: 'Linux' },
        { id: 3, name: 'Docker' },
      ];
      const gameOptions = GameOptions.from(categories);
      gameService.getGameOptions.mockResolvedValue(gameOptions);

      const result = await controller.getGameOptions();

      expect(result).toBeInstanceOf(GetGameOptionsResponseDto);
      expect(result).toEqual({
        categories,
        difficultyModes: DIFFICULTY_MODES,
      });
      expect(gameService.getGameOptions).toHaveBeenCalledTimes(1);
    });
  });

  describe('getGameHistories', () => {
    const createQuery = (
      overrides?: Partial<GetGameHistoriesQueryDto>,
    ): GetGameHistoriesQueryDto => ({
      userId: 1n,
      page: 1,
      size: 10,
      sortBy: GameSessionSortBy.PlayedAt,
      sortOrder: SortOrder.Desc,
      ...overrides,
    });

    it('세션 히스토리 목록을 정상적으로 응답한다.', async () => {
      const query = createQuery();
      const historyList = GameSessionHistoryList.from({
        sessionHistories: [],
        totalItems: 0,
      });
      gameSessionService.getSessionHistories.mockResolvedValue(historyList);

      const result = await controller.getGameHistories(query);

      expect(result).toBeInstanceOf(GetGameHistoriesResponseDto);
      expect(result).toEqual({
        sessions: [],
        metadata: { page: 1, size: 10, totalItems: 0, totalPages: 0 },
      });
      expect(gameSessionService.getSessionHistories).toHaveBeenCalledWith(query);
    });
  });
});
