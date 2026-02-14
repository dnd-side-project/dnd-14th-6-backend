import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';
import { GameProblem } from '../domain/game-problem.entity';
import {
  DIFFICULTY_SCORES,
  GameDifficultyMode,
  MAX_PROBLEMS_PER_GAME,
  ProblemDifficulty,
} from '../domain/game.business-rules';
import { ClientAnswer } from '../domain/game-client-answers.interface';

const createMockProblem = (id: number, difficulty: ProblemDifficulty = 'Easy'): GameProblem =>
  GameProblem.from({
    id: BigInt(id),
    title: `문제 ${id}`,
    subCategoryName: 'Test',
    text: `문제 ${id}`,
    answer: `answer`,
    point: DIFFICULTY_SCORES[difficulty],
    difficulty,
  });

const createClientAnswers = (
  overrides: Record<number, Partial<ClientAnswer>> = {},
): ClientAnswer[] =>
  Array.from({ length: MAX_PROBLEMS_PER_GAME }, (_, i) => ({
    problemId: String(i + 1),
    inputs: [],
    solved: false,
    ...overrides[i],
  }));
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
      categoryExists: jest.fn(),
      findProblemsByIds: jest.fn(),
      saveGameSession: jest.fn(),
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

  describe('createGameSession', () => {
    const mockProblems: GameProblem[] = [
      createMockProblem(1, 'Easy'),
      createMockProblem(2, 'Normal'),
      createMockProblem(3, 'Hard'),
      ...Array.from({ length: 17 }, (_, i) => createMockProblem(i + 4, 'Easy')),
    ];

    describe('✅ 성공 케이스', () => {
      it('게임 세션을 정상적으로 저장하고 gameSessionId를 반환한다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);
        gameRepository.saveGameSession.mockResolvedValue(BigInt(100));

        const clientAnswers = createClientAnswers({
          0: { inputs: [{ input: 'git init', isCorrect: true }], solved: true },
          1: {
            inputs: [
              { input: 'git add', isCorrect: false },
              { input: 'git commit', isCorrect: true },
            ],
            solved: true,
          },
          2: { inputs: [{ input: 'git merge', isCorrect: false }], solved: false },
        });

        const result = await service.createGameSession({
          categoryId: 1,
          difficultyMode: GameDifficultyMode.Normal,
          score: 999,
          clientAnswers,
        });

        expect(result).toBe(BigInt(100));
        // Easy(10) + Normal(30) = 40 (Hard는 미해결)
        expect(gameRepository.saveGameSession).toHaveBeenCalledWith(
          expect.objectContaining({
            score: 40,
            totalProblemCount: MAX_PROBLEMS_PER_GAME,
            correctProblemCount: 2,
          }),
        );
      });

      it('모든 문제를 틀려도 gameSessionId를 정상 반환한다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);
        gameRepository.saveGameSession.mockResolvedValue(BigInt(101));

        const clientAnswers = createClientAnswers();

        const result = await service.createGameSession({
          categoryId: 1,
          difficultyMode: GameDifficultyMode.Easy,
          score: 0,
          clientAnswers,
        });

        expect(result).toBe(BigInt(101));
        expect(gameRepository.saveGameSession).toHaveBeenCalledWith(
          expect.objectContaining({
            score: 0,
            correctProblemCount: 0,
            totalProblemCount: MAX_PROBLEMS_PER_GAME,
          }),
        );
      });

      it('실제로는 0점인데 클라이언트가 999점으로 점수조작하더라도, 0점으로 계산됨을 성공한다', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);
        gameRepository.saveGameSession.mockResolvedValue(BigInt(103));

        const clientAnswers = createClientAnswers({
          0: { inputs: [{ input: 'wrong', isCorrect: false }], solved: false },
        });

        const result = await service.createGameSession({
          categoryId: 1,
          difficultyMode: GameDifficultyMode.Easy,
          score: 999,
          clientAnswers,
        });

        expect(result).toBe(BigInt(103));
        expect(gameRepository.saveGameSession).toHaveBeenCalledWith(
          expect.objectContaining({ score: 0, correctProblemCount: 0 }),
        );
      });
    });

    describe('❌ 실패 케이스', () => {
      it('존재하지 않는 카테고리면 NotFoundException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(false);

        await expect(
          service.createGameSession({
            categoryId: 999,
            difficultyMode: GameDifficultyMode.Easy,
            score: 0,
            clientAnswers: createClientAnswers(),
          }),
        ).rejects.toThrow(NotFoundException);

        expect(gameRepository.findProblemsByIds).not.toHaveBeenCalled();
        expect(gameRepository.saveGameSession).not.toHaveBeenCalled();
      });

      it(`clientAnswers가 ${MAX_PROBLEMS_PER_GAME}개가 아니면 BadRequestException을 던진다.`, async () => {
        gameRepository.categoryExists.mockResolvedValue(true);

        await expect(
          service.createGameSession({
            categoryId: 1,
            difficultyMode: GameDifficultyMode.Easy,
            score: 0,
            clientAnswers: [],
          }),
        ).rejects.toThrow(BadRequestException);

        expect(gameRepository.findProblemsByIds).not.toHaveBeenCalled();
        expect(gameRepository.saveGameSession).not.toHaveBeenCalled();
      });

      it('존재하지 않는 문제가 포함되어 있으면 NotFoundException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        // 20개 요청했는데 19개만 조회됨 (problemId=3 누락)
        const problemsWithout3 = mockProblems.filter((p) => p.id !== BigInt(3));
        gameRepository.findProblemsByIds.mockResolvedValue(problemsWithout3);

        const clientAnswers = createClientAnswers();

        await expect(
          service.createGameSession({
            categoryId: 1,
            difficultyMode: GameDifficultyMode.Normal,
            score: 0,
            clientAnswers,
          }),
        ).rejects.toThrow(NotFoundException);

        expect(gameRepository.saveGameSession).not.toHaveBeenCalled();
      });

      it('solved=true인데 정답 입력이 없으면 BadRequestException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);

        const clientAnswers = createClientAnswers({
          0: {
            inputs: [{ input: 'wrong', isCorrect: false }],
            solved: true,
          },
        });

        await expect(
          service.createGameSession({
            categoryId: 1,
            difficultyMode: GameDifficultyMode.Easy,
            score: 0,
            clientAnswers,
          }),
        ).rejects.toThrow(BadRequestException);

        expect(gameRepository.saveGameSession).not.toHaveBeenCalled();
      });

      it('solved=true이고 inputs가 빈 배열이면 BadRequestException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);

        const clientAnswers = createClientAnswers({
          0: { inputs: [], solved: true },
        });

        await expect(
          service.createGameSession({
            categoryId: 1,
            difficultyMode: GameDifficultyMode.Easy,
            score: 0,
            clientAnswers,
          }),
        ).rejects.toThrow(BadRequestException);

        expect(gameRepository.saveGameSession).not.toHaveBeenCalled();
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
