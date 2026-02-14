import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';
import {
  FrequentWrongCommand,
  FrequentWrongCategory,
  UserMistakeAnalysis,
} from '../domain/user-mistake-analysis.entity';

describe('GamesService', () => {
  let service: GamesService;
  let gameRepository: jest.Mocked<IGameRepository>;

  beforeEach(async () => {
    const mockGameRepository: Partial<jest.Mocked<IGameRepository>> = {
      getCategories: jest.fn(),
      getFrequentWrongCommands: jest.fn(),
      getFrequentWrongCategories: jest.fn(),
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

  describe('getUserMistakeAnalysis', () => {
    const userId = 1n;
    let mockCommands: FrequentWrongCommand[];
    let mockCategories: FrequentWrongCategory[];

    beforeEach(() => {
      mockCommands = [
        FrequentWrongCommand.from({ subCategory: 'Branch', wrongCount: 12 }),
        FrequentWrongCommand.from({ subCategory: 'Commit', wrongCount: 9 }),
        FrequentWrongCommand.from({ subCategory: 'Merge', wrongCount: 7 }),
        FrequentWrongCommand.from({ subCategory: 'Remote', wrongCount: 5 }),
        FrequentWrongCommand.from({ subCategory: 'Rebase', wrongCount: 3 }),
      ];

      mockCategories = [
        FrequentWrongCategory.from({
          category: 'Git',
          wrongRatio: 48,
          wrongCount: 24,
          iconUrl: 'https://example.com/icons/git.png',
        }),
        FrequentWrongCategory.from({
          category: 'Docker',
          wrongRatio: 30,
          wrongCount: 12,
          iconUrl: 'https://example.com/icons/docker.png',
        }),
        FrequentWrongCategory.from({
          category: 'Linux',
          wrongRatio: 22,
          wrongCount: 10,
          iconUrl: 'https://example.com/icons/linux.png',
        }),
      ];

      gameRepository.getFrequentWrongCommands.mockResolvedValue(mockCommands);
      gameRepository.getFrequentWrongCategories.mockResolvedValue(mockCategories);
    });

    it('repository의 두 메서드를 병렬로 호출하는지 확인', async () => {
      await service.getUserMistakeAnalysis(userId);

      expect(gameRepository.getFrequentWrongCommands).toHaveBeenCalledWith(userId);
      expect(gameRepository.getFrequentWrongCategories).toHaveBeenCalledWith(userId);
    });

    it('자주 틀린 명령어와 카테고리를 포함한 분석 결과를 반환하는지 확인', async () => {
      const result = await service.getUserMistakeAnalysis(userId);

      expect(result).toBeInstanceOf(UserMistakeAnalysis);
      expect(result.frequentWrongCommands).toHaveLength(5);
      expect(result.frequentWrongCategories).toHaveLength(3);
    });

    it('자주 틀린 명령어가 올바른 순서와 데이터로 반환되는지 확인', async () => {
      const result = await service.getUserMistakeAnalysis(userId);

      expect(result.frequentWrongCommands[0]).toMatchObject({
        subCategory: 'Branch',
        wrongCount: 12,
      });
      expect(result.frequentWrongCommands[1]).toMatchObject({
        subCategory: 'Commit',
        wrongCount: 9,
      });
      expect(result.frequentWrongCommands[4]).toMatchObject({
        subCategory: 'Rebase',
        wrongCount: 3,
      });
    });

    it('자주 틀린 카테고리에 iconUrl이 포함되어 반환되는지 확인', async () => {
      const result = await service.getUserMistakeAnalysis(userId);

      expect(result.frequentWrongCategories[0]).toMatchObject({
        category: 'Git',
        wrongRatio: 48,
        wrongCount: 24,
        iconUrl: 'https://example.com/icons/git.png',
      });
    });

    it('repository가 빈 배열을 반환해도 정상 처리하는지 확인', async () => {
      gameRepository.getFrequentWrongCommands.mockResolvedValue([]);
      gameRepository.getFrequentWrongCategories.mockResolvedValue([]);

      const result = await service.getUserMistakeAnalysis(userId);

      expect(result.frequentWrongCommands).toEqual([]);
      expect(result.frequentWrongCategories).toEqual([]);
    });

    it('repository 메서드 중 하나가 실패하면 에러를 전파하는지 확인', async () => {
      const error = new Error('Database connection failed');
      gameRepository.getFrequentWrongCommands.mockRejectedValue(error);

      await expect(service.getUserMistakeAnalysis(userId)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
