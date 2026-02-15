import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionService } from './game-session.service';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
import { GameSessionSortBy, SortOrder } from '../domain/game.business-rules';

describe('GameSessionService', () => {
  let service: GameSessionService;
  let gameRepository: jest.Mocked<Pick<IGameRepository, 'getSessionHistoryByFilter'>>;

  beforeEach(async () => {
    const mockGameRepository = {
      getSessionHistoryByFilter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionService,
        {
          provide: GAME_REPOSITORY,
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    service = module.get<GameSessionService>(GameSessionService);
    gameRepository = module.get(GAME_REPOSITORY);
  });

  describe('getSessionHistories', () => {
    const createFilter = (
      overrides?: Partial<Parameters<typeof GameSessionHistoryFilterEntity.from>[0]>,
    ) =>
      GameSessionHistoryFilterEntity.from({
        userId: 1n,
        page: 1,
        size: 10,
        sortBy: GameSessionSortBy.PlayedAt,
        sortOrder: SortOrder.Desc,
        ...overrides,
      });

    it('필터 기반 세션 히스토리 목록 조회에 성공한다.', async () => {
      const filter = createFilter();
      const expectedResult = GameSessionHistoryList.from({
        sessionHistories: [],
        totalItems: 0,
      });
      gameRepository.getSessionHistoryByFilter.mockResolvedValue(expectedResult);

      const result = await service.getSessionHistories(filter);

      expect(result).toEqual(expectedResult);
      expect(gameRepository.getSessionHistoryByFilter).toHaveBeenCalledWith(filter);
    });
  });
});
