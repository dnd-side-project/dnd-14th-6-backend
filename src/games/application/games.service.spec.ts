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

describe('GamesService', () => {
  let service: GamesService;
  let gameRepository: jest.Mocked<IGameRepository>;

  beforeEach(async () => {
    const mockGameRepository: Partial<jest.Mocked<IGameRepository>> = {
      getCategories: jest.fn(),
      categoryExists: jest.fn(),
      findProblemsByIds: jest.fn(),
      saveGameSession: jest.fn(),
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
    });
  });
});
