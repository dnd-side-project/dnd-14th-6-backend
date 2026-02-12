import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';
import { GameProblem } from '../domain/game-problem.entity';
import { GameDifficultyMode } from '../domain/game.business-rules';
import { ClientAnswer } from '../domain/game-client-answers.interface';

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
    const mockProblems = [
      GameProblem.from({
        id: BigInt(1),
        title: 'Git 문제 1',
        subCategoryName: 'Git Basics',
        text: 'git init은?',
        answer: 'git init',
        point: 10,
        difficulty: GameDifficultyMode.Easy,
      }),
      GameProblem.from({
        id: BigInt(2),
        title: 'Git 문제 2',
        subCategoryName: 'Git Basics',
        text: 'git commit은?',
        answer: 'git commit',
        point: 30,
        difficulty: GameDifficultyMode.Normal,
      }),
      GameProblem.from({
        id: BigInt(3),
        title: 'Git 문제 3',
        subCategoryName: 'Git Advanced',
        text: 'git rebase는?',
        answer: 'git rebase',
        point: 50,
        difficulty: GameDifficultyMode.Hard,
      }),
    ];

    const createClientAnswers = (): ClientAnswer[] => [
      {
        problemId: '1',
        inputs: [{ input: 'git init', isCorrect: true }],
        solved: true,
      },
      {
        problemId: '2',
        inputs: [
          { input: 'git add', isCorrect: false },
          { input: 'git commit', isCorrect: true },
        ],
        solved: true,
      },
      {
        problemId: '3',
        inputs: [{ input: 'git merge', isCorrect: false }],
        solved: false,
      },
    ];

    describe('✅ 성공 케이스', () => {
      it('게임 세션을 정상적으로 저장하고 gameSessionId를 반환한다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);
        gameRepository.saveGameSession.mockResolvedValue(BigInt(100));

        const clientAnswers = createClientAnswers();

        const result = await service.createGameSession({
          categoryId: 1,
          difficultyMode: GameDifficultyMode.Normal,
          score: 999, // 클라이언트 점수는 무시됨
          clientAnswers,
        });

        expect(result).toBe(BigInt(100));

        expect(gameRepository.categoryExists).toHaveBeenCalledWith(1);
        expect(gameRepository.findProblemsByIds).toHaveBeenCalledWith([
          BigInt(1),
          BigInt(2),
          BigInt(3),
        ]);
        // Easy(10) + Normal(30) = 40 (Hard는 미해결)
        expect(gameRepository.saveGameSession).toHaveBeenCalledWith({
          categoryId: 1,
          difficultyMode: GameDifficultyMode.Normal,
          score: 40,
          totalProblemCount: 3,
          correctProblemCount: 2,
          logs: [
            {
              problemId: BigInt(1),
              inputs: [{ input: 'git init', isCorrect: true }],
              isSolved: true,
              tryCount: 1,
            },
            {
              problemId: BigInt(2),
              inputs: [
                { input: 'git add', isCorrect: false },
                { input: 'git commit', isCorrect: true },
              ],
              isSolved: true,
              tryCount: 2,
            },
            {
              problemId: BigInt(3),
              inputs: [{ input: 'git merge', isCorrect: false }],
              isSolved: false,
              tryCount: 1,
            },
          ],
        });
      });
      it('모든 문제를 틀려도 gameSessionId를 정상 반환한다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue([mockProblems[0]]);
        gameRepository.saveGameSession.mockResolvedValue(BigInt(101));

        const clientAnswers: ClientAnswer[] = [
          {
            problemId: '1',
            inputs: [{ input: 'wrong', isCorrect: false }],
            solved: false,
          },
        ];

        const result = await service.createGameSession({
          categoryId: 1,
          difficultyMode: GameDifficultyMode.Easy,
          score: 0,
          clientAnswers,
        });

        expect(result).toBe(BigInt(101));
        expect(gameRepository.saveGameSession).toHaveBeenCalledWith(
          expect.objectContaining({ score: 0, correctProblemCount: 0, totalProblemCount: 1 }),
        );
      });
      it('clientAnswers가 빈 배열이면 점수 0으로 세션을 저장한다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue([]);
        gameRepository.saveGameSession.mockResolvedValue(BigInt(102));

        const result = await service.createGameSession({
          categoryId: 1,
          difficultyMode: GameDifficultyMode.Random,
          score: 0,
          clientAnswers: [],
        });

        expect(result).toBe(BigInt(102));
        expect(gameRepository.saveGameSession).toHaveBeenCalledWith(
          expect.objectContaining({ score: 0, totalProblemCount: 0, correctProblemCount: 0 }),
        );
      });
      it('실제로는 0점인데 클라이언트가 999점으로 점수조작하더라도, 0점으로 계산됨을 성공한다', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);
        gameRepository.saveGameSession.mockResolvedValue(BigInt(103));

        const clientAnswers: ClientAnswer[] = [
          {
            problemId: '1',
            inputs: [{ input: 'wrong', isCorrect: false }],
            solved: false,
          },
          {
            problemId: '2',
            inputs: [{ input: 'wrong', isCorrect: false }],
            solved: false,
          },
          {
            problemId: '3',
            inputs: [{ input: 'wrong', isCorrect: false }],
            solved: false,
          },
        ];

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
            clientAnswers: [],
          }),
        ).rejects.toThrow(NotFoundException);

        expect(gameRepository.findProblemsByIds).not.toHaveBeenCalled();
        expect(gameRepository.saveGameSession).not.toHaveBeenCalled();
      });

      it('존재하지 않는 문제가 포함되어 있으면 NotFoundException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        // 3개 요청했는데 2개만 조회됨 (problemId=3 누락)
        gameRepository.findProblemsByIds.mockResolvedValue([mockProblems[0], mockProblems[1]]);

        const clientAnswers = createClientAnswers();

        await expect(
          service.createGameSession({
            categoryId: 1,
            difficultyMode: GameDifficultyMode.Normal,
            score: 0,
            clientAnswers,
          }),
        ).rejects.toThrow(
          new NotFoundException('존재하지 않는 문제 ID가 포함되어 있습니다. (problemId: 3)'),
        );

        expect(gameRepository.saveGameSession).not.toHaveBeenCalled();
      });

      it('solved=true인데 정답 입력이 없으면 BadRequestException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue([mockProblems[0]]);

        const clientAnswers: ClientAnswer[] = [
          {
            problemId: '1',
            inputs: [{ input: 'wrong', isCorrect: false }],
            solved: true, // solved=true인데 isCorrect=true인 입력이 없음
          },
        ];

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
        gameRepository.findProblemsByIds.mockResolvedValue([mockProblems[0]]);

        const clientAnswers: ClientAnswer[] = [
          {
            problemId: '1',
            inputs: [],
            solved: true, // solved=true인데 inputs 자체가 비어있음
          },
        ];

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
