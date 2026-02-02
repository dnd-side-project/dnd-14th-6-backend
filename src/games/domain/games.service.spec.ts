import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GAME, IGameRepository } from './games.repository.interface';
import { CategoryResult } from './games.types';
import { DIFFICULTY_MODES } from './game.business-rules';

describe('GamesService', () => {
  let service: GamesService;
  let gameRepository: jest.Mocked<IGameRepository>;

  beforeEach(async () => {
    const mockGameRepository: jest.Mocked<IGameRepository> = {
      getCategories: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: GAME,
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    gameRepository = module.get(GAME);
  });

  describe('getGameOptions', () => {
    it('게임옵션 정보 조회에 성공한다.', async () => {
      const expectedCategories: CategoryResult[] = [
        { id: 1, name: 'Git' },
        { id: 2, name: 'Linux' },
        { id: 3, name: 'Docker' },
      ];
      gameRepository.getCategories.mockResolvedValue(expectedCategories);

      const result = await service.getGameOptions();

      expect(result).toEqual({
        categories: expectedCategories,
        difficultyModes: DIFFICULTY_MODES,
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(gameRepository.getCategories).toHaveBeenCalledTimes(1);
    });
  });
});
