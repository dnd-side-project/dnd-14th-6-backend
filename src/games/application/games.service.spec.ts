import { Test, TestingModule } from '@nestjs/testing';

import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GamesService } from './games.service';

describe('GamesService', () => {
  let service: GamesService;
  let gameRepository: jest.Mocked<IGameRepository>;

  beforeEach(async () => {
    const mockGameRepository: Partial<jest.Mocked<IGameRepository>> = {
      getCategories: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: GAME_REPOSITORY,
          useValue: mockGameRepository as IGameRepository,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    gameRepository = module.get(GAME_REPOSITORY);
  });

  describe('getGameOptions', () => {
    it('게임옵션 정보 조회에 성공한다.', async () => {
      const expectedCategories: GameCategory[] = [
        { id: 1, name: 'Git', iconUrl: 'https://fake-storage/categories/git.png' },
        { id: 2, name: 'Linux', iconUrl: 'https://fake-storage/categories/linux.png' },
        { id: 3, name: 'Docker', iconUrl: 'https://fake-storage/categories/docker.png' },
      ];
      gameRepository.getCategories.mockResolvedValue(expectedCategories);

      const result = await service.getGameOptions();

      expect(result).toEqual(GameOptions.from(expectedCategories));

      expect(gameRepository.getCategories).toHaveBeenCalledTimes(1);
    });
  });
});
