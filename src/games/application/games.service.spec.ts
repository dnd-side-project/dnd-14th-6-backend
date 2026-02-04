import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';

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
          provide: GAME_REPOSITORY,
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    gameRepository = module.get(GAME_REPOSITORY);
  });

  describe('getGameOptions', () => {
    it('게임옵션 정보 조회에 성공한다.', async () => {
      const expectedCategories: GameCategory[] = [
        { id: 1, name: 'Git' },
        { id: 2, name: 'Linux' },
        { id: 3, name: 'Docker' },
      ];
      gameRepository.getCategories.mockResolvedValue(expectedCategories);

      const result = await service.getGameOptions();

      expect(result).toEqual(GameOptions.from(expectedCategories));

      expect(gameRepository.getCategories).toHaveBeenCalledTimes(1);
    });
  });
});
