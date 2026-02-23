import { Test, TestingModule } from '@nestjs/testing';

import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { CategoryScore, DifficultyScoreDetail } from '../domain/score-detail.entity';
import {
  FrequentWrongCategory,
  FrequentWrongCommand,
} from '../domain/user-mistake-analysis.entity';
import { GameAnalyticsService } from './game-analytics.service';

describe('GameAnalyticsService', () => {
  let service: GameAnalyticsService;
  let gameRepository: jest.Mocked<
    Pick<
      IGameRepository,
      'getFrequentWrongCommands' | 'getFrequentWrongCategories' | 'getScoreDetailByUserId'
    >
  >;

  beforeEach(async () => {
    const mockGameRepository = {
      getFrequentWrongCommands: jest.fn(),
      getFrequentWrongCategories: jest.fn(),
      getScoreDetailByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameAnalyticsService,
        {
          provide: GAME_REPOSITORY,
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    service = module.get<GameAnalyticsService>(GameAnalyticsService);
    gameRepository = module.get(GAME_REPOSITORY);
  });

  describe('getUserMistakeAnalysis', () => {
    const userId = 1n;

    it('자주 틀린 명령어/카테고리 분석을 반환한다.', async () => {
      const mockCommands: FrequentWrongCommand[] = [
        FrequentWrongCommand.from({ category: 'Git', subCategory: 'Branch', wrongCount: 12 }),
        FrequentWrongCommand.from({ category: 'Git', subCategory: 'Commit', wrongCount: 9 }),
      ];
      const mockCategories: FrequentWrongCategory[] = [
        FrequentWrongCategory.from({
          category: 'Git',
          wrongRatio: 48,
          wrongCount: 24,
          iconUrl: 'https://example.com/icons/git.png',
        }),
      ];

      gameRepository.getFrequentWrongCommands.mockResolvedValue(mockCommands);
      gameRepository.getFrequentWrongCategories.mockResolvedValue(mockCategories);

      const result = await service.getUserMistakeAnalysis(userId);

      expect(result.frequentWrongCommands).toEqual(mockCommands);
      expect(result.frequentWrongCategories).toEqual(mockCategories);
    });

    it('repository 메서드 중 하나가 실패하면 에러를 전파한다.', async () => {
      const error = new Error('Database connection failed');
      gameRepository.getFrequentWrongCommands.mockRejectedValue(error);

      await expect(service.getUserMistakeAnalysis(userId)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('getScoreDetailByUserId', () => {
    it('난이도/카테고리별 점수 상세를 반환한다.', async () => {
      const mockScoreDetail: DifficultyScoreDetail[] = [
        DifficultyScoreDetail.from({
          difficultyMode: 'Hard',
          totalScore: 28660n,
          categoryScores: [
            CategoryScore.from({ category: 'Git', score: 17650n }),
            CategoryScore.from({ category: 'Linux', score: 11010n }),
          ],
        }),
      ];
      gameRepository.getScoreDetailByUserId.mockResolvedValue(mockScoreDetail);

      const result = await service.getScoreDetailByUserId(1n);

      expect(result).toHaveLength(1);
      expect(result[0].difficultyMode).toBe('Hard');
      expect(result[0].totalScore).toBe(28660n);
      expect(result[0].categoryScores).toHaveLength(2);
    });

    it('데이터가 없으면 빈 배열을 반환한다.', async () => {
      gameRepository.getScoreDetailByUserId.mockResolvedValue([]);

      const result = await service.getScoreDetailByUserId(1n);

      expect(result).toEqual([]);
    });
  });
});
