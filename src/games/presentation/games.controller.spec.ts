import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from '../application/games.service';
import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';
import { DIFFICULTY_MODES } from '../domain/game.business-rules';
import { GetGameOptionsResponseDto } from './dto/get-game-options.dto';

describe('GamesController', () => {
  let controller: GamesController;
  let gameService: jest.Mocked<GamesService>;

  beforeEach(async () => {
    const mockGameService = {
      getGameOptions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gameService = module.get(GamesService);
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
      expect(result.categories).toEqual(categories);
      expect(result.difficultyModes).toEqual(DIFFICULTY_MODES);
      expect(gameService.getGameOptions).toHaveBeenCalledTimes(1);
    });
  });
});
