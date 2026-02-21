import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ClientAnswer } from '../domain/game-client-answers.interface';
import { GameProblem } from '../domain/game-problem.entity';
import {
  GameResultProblemReport,
  GameResultReport,
  GameResultSummary,
} from '../domain/game-result-report.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
import {
  DIFFICULTY_SCORES,
  GameDifficultyMode,
  GameSessionSortBy,
  GUEST_MAX_VIEWABLE_PROBLEMS,
  MAX_PROBLEMS_PER_GAME,
  ProblemDifficulty,
  SortOrder,
} from '../domain/game.business-rules';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameSessionService } from './game-session.service';

describe('GameSessionService', () => {
  let service: GameSessionService;
  let gameRepository: jest.Mocked<
    Pick<
      IGameRepository,
      | 'getSessionHistoryByFilter'
      | 'findGameResultReport'
      | 'categoryExists'
      | 'findProblemsByIds'
      | 'saveGameSession'
    >
  >;

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

  const mockProblems: GameProblem[] = [
    createMockProblem(1, 'Easy'),
    createMockProblem(2, 'Normal'),
    createMockProblem(3, 'Hard'),
    ...Array.from({ length: 17 }, (_, i) => createMockProblem(i + 4, 'Easy')),
  ];

  beforeEach(async () => {
    const mockGameRepository = {
      getSessionHistoryByFilter: jest.fn(),
      findGameResultReport: jest.fn(),
      categoryExists: jest.fn(),
      findProblemsByIds: jest.fn(),
      saveGameSession: jest.fn(),
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

  describe('validateAndCalculateScore', () => {
    describe('✅ 성공 케이스', () => {
      it('클라이언트 답안을 검증하고 서버 점수를 계산하여 반환한다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);

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

        const result = await service.validateAndCalculateScore(1, clientAnswers);

        // Easy(10) + Normal(30) = 40 (Hard는 미해결)
        expect(result).toBe(40);
      });

      it('모든 문제를 틀리면 0점을 반환한다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        gameRepository.findProblemsByIds.mockResolvedValue(mockProblems);

        const clientAnswers = createClientAnswers();

        const result = await service.validateAndCalculateScore(1, clientAnswers);

        expect(result).toBe(0);
      });
    });

    describe('❌ 실패 케이스', () => {
      it('존재하지 않는 카테고리면 NotFoundException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(false);

        await expect(service.validateAndCalculateScore(999, createClientAnswers())).rejects.toThrow(
          NotFoundException,
        );
      });

      it('clientAnswers에 중복된 problemId가 포함되어 있으면 BadRequestException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);

        // problemId "1"을 2번 사용하여 중복 발생 (총 20개는 유지)
        const clientAnswers = createClientAnswers({
          19: {
            problemId: '1',
            inputs: [{ input: 'git init', isCorrect: true }],
            solved: true,
          },
        });

        await expect(service.validateAndCalculateScore(1, clientAnswers)).rejects.toThrow(
          BadRequestException,
        );

        expect(gameRepository.findProblemsByIds).not.toHaveBeenCalled();
      });

      it('존재하지 않는 문제가 포함되어 있으면 NotFoundException을 던진다.', async () => {
        gameRepository.categoryExists.mockResolvedValue(true);
        // 20개 요청했는데 19개만 조회됨 (problemId=3 누락)
        const problemsWithout3 = mockProblems.filter((p) => p.id !== BigInt(3));
        gameRepository.findProblemsByIds.mockResolvedValue(problemsWithout3);

        const clientAnswers = createClientAnswers();

        await expect(service.validateAndCalculateScore(1, clientAnswers)).rejects.toThrow(
          NotFoundException,
        );
      });

      it('solved=true인데 정답 입력이 없으면 BadRequestException을 던진다.', async () => {
        const clientAnswers = createClientAnswers({
          0: {
            inputs: [{ input: 'wrong', isCorrect: false }],
            solved: true,
          },
        });

        await expect(service.validateAndCalculateScore(1, clientAnswers)).rejects.toThrow(
          BadRequestException,
        );

        expect(gameRepository.categoryExists).not.toHaveBeenCalled();
        expect(gameRepository.findProblemsByIds).not.toHaveBeenCalled();
      });

      it('solved=true이고 inputs가 빈 배열이면 BadRequestException을 던진다.', async () => {
        const clientAnswers = createClientAnswers({
          0: { inputs: [], solved: true },
        });

        await expect(service.validateAndCalculateScore(1, clientAnswers)).rejects.toThrow(
          BadRequestException,
        );

        expect(gameRepository.categoryExists).not.toHaveBeenCalled();
        expect(gameRepository.findProblemsByIds).not.toHaveBeenCalled();
      });
    });
  });

  describe('createGameSession', () => {
    describe('✅ 성공 케이스', () => {
      it('게임 세션을 정상적으로 저장하고 gameSessionId를 반환한다.', async () => {
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
          score: 40,
          clientAnswers,
        });

        expect(result).toBe(BigInt(100));
        expect(gameRepository.saveGameSession).toHaveBeenCalledWith(
          expect.objectContaining({
            score: 40,
            totalProblemCount: MAX_PROBLEMS_PER_GAME,
            correctProblemCount: 2,
          }),
        );
      });

      it('모든 문제를 틀려도 gameSessionId를 정상 반환한다.', async () => {
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

      it('userId가 전달되면 userId를 포함한 게임 세션을 저장한다.', async () => {
        gameRepository.saveGameSession.mockResolvedValue(BigInt(102));

        const clientAnswers = createClientAnswers({
          0: { inputs: [{ input: 'git init', isCorrect: true }], solved: true },
        });

        const userId = 99n;
        const result = await service.createGameSession({
          categoryId: 1,
          difficultyMode: GameDifficultyMode.Easy,
          score: 10,
          clientAnswers,
          userId: userId,
        });

        expect(result).toBe(BigInt(102));
        expect(gameRepository.saveGameSession).toHaveBeenCalledWith(
          expect.objectContaining({ userId: 99n }),
        );
      });
    });
  });

  describe('getGameResultReport', () => {
    const createMockProblemReport = (index: number): GameResultProblemReport =>
      GameResultProblemReport.from({
        problemId: BigInt(100 + index),
        subCategory: index < 10 ? 'Remote' : 'Branch',
        text: `문제${index + 1} 지문`,
        explanation: `문제${index + 1} 해설`,
        inputs: [
          { input: '오답', isCorrect: false },
          { input: '정답', isCorrect: true },
        ],
        answer: `문제${index + 1} 정답`,
        isSolved: true,
        tryCount: 2,
      });

    const createMockGameResultReport = (
      userId: bigint | null,
      problemCount = 20,
    ): GameResultReport => {
      const summary = GameResultSummary.from({
        sessionId: 7n,
        userId,
        score: 30,
        totalProblemCount: problemCount,
        correctProblemCount: 3,
      });

      const reports = Array.from({ length: problemCount }, (_, i) => createMockProblemReport(i));

      return GameResultReport.from({
        isGuest: userId === null,
        summary,
        reports,
      });
    };

    describe('회원용', () => {
      describe('✅ 성공 케이스', () => {
        it('게임 결과 리포트를 정상적으로 반환한다.', async () => {
          const gameSessionId = 7n;
          const userId = 1n;
          const expectedReport = createMockGameResultReport(userId);
          gameRepository.findGameResultReport.mockResolvedValue(expectedReport);

          const result = await service.getGameResultReport(gameSessionId);

          expect(result).toEqual(expectedReport);
          expect(result.isGuest).toBe(false);
          expect(result.summary.userId).toBe(1n);
          expect(result.summary.correctRate).toBe(15);
          expect(gameRepository.findGameResultReport).toHaveBeenCalledWith(gameSessionId);
        });
      });

      describe('❌ 실패 케이스', () => {
        it('존재하지 않는 게임 세션 ID이면 NotFoundException을 던진다.', async () => {
          const gameSessionId = 999n;
          gameRepository.findGameResultReport.mockResolvedValue(null);

          await expect(service.getGameResultReport(gameSessionId)).rejects.toThrow(
            new NotFoundException('존재하지 않는 게임 세션입니다.'),
          );
        });

        it('다른 회원의 게임 결과 리포트에 접근하면 ForbiddenException을 던진다.', async () => {
          const gameSessionId = 7n;
          const reportOwnerUserId = 1n;
          const accessRequestUserId = 2n;
          const mockReport = createMockGameResultReport(reportOwnerUserId);
          gameRepository.findGameResultReport.mockResolvedValue(mockReport);

          await expect(
            service.getGameResultReport(gameSessionId, accessRequestUserId),
          ).rejects.toThrow(new ForbiddenException('해당 게임 결과 리포트에 접근할 수 없습니다.'));
        });
      });
    });

    describe('비회원용', () => {
      describe('✅ 성공 케이스', () => {
        it('비회원 게임 결과 리포트에 열람 제한이 적용된다.', async () => {
          const gameSessionId = 7n;
          const mockReport = createMockGameResultReport(null);
          gameRepository.findGameResultReport.mockResolvedValue(mockReport);

          const result = await service.getGameResultReport(gameSessionId);

          expect(result.isGuest).toBe(true);
          expect(result.summary.userId).toBeNull();
          expect(result.summary.score).toBeNull();
          expect(result.summary.totalProblemCount).toBeNull();
          expect(result.summary.correctProblemCount).toBeNull();
          expect(result.summary.correctRate).toBeNull();
          expect(gameRepository.findGameResultReport).toHaveBeenCalledWith(gameSessionId);
        });

        it(`비회원은 문제 1~${GUEST_MAX_VIEWABLE_PROBLEMS}만 전체 열람이 가능하다.`, async () => {
          const gameSessionId = 7n;
          const mockReport = createMockGameResultReport(null);
          gameRepository.findGameResultReport.mockResolvedValue(mockReport);

          const result = await service.getGameResultReport(gameSessionId);
          const viewableReports = result.reports.slice(0, GUEST_MAX_VIEWABLE_PROBLEMS);

          for (const report of viewableReports) {
            expect(report.text).not.toBeNull();
            expect(report.explanation).not.toBeNull();
            expect(report.inputs.length).toBeGreaterThan(0);
            expect(report.answer).not.toBeNull();
            expect(report.isSolved).toBeNull();
            expect(report.tryCount).toBeNull();
          }
        });

        it(`비회원은 문제 ${GUEST_MAX_VIEWABLE_PROBLEMS + 1} 이후 데이터가 잠금 처리된다.`, async () => {
          const gameSessionId = 7n;
          const mockReport = createMockGameResultReport(null);
          gameRepository.findGameResultReport.mockResolvedValue(mockReport);

          const result = await service.getGameResultReport(gameSessionId);
          const lockedReports = result.reports.slice(GUEST_MAX_VIEWABLE_PROBLEMS);

          // 11번 문제
          expect(lockedReports[0].problemId).toBeDefined();
          expect(lockedReports[0].subCategory).toBeDefined();
          expect(lockedReports[0].text).toBeNull();
          expect(lockedReports[0].explanation).toBeNull();
          expect(lockedReports[0].inputs).toEqual([]);
          expect(lockedReports[0].answer).toBeNull();
          expect(lockedReports[0].isSolved).toBeNull();
          expect(lockedReports[0].tryCount).toBeNull();
        });
      });

      describe('❌ 실패 케이스', () => {
        it('존재하지 않는 게임 세션 ID이면 NotFoundException을 던진다.', async () => {
          const gameSessionId = 999n;
          gameRepository.findGameResultReport.mockResolvedValue(null);

          await expect(service.getGameResultReport(gameSessionId)).rejects.toThrow(
            NotFoundException,
          );
          await expect(service.getGameResultReport(gameSessionId)).rejects.toThrow(
            '존재하지 않는 게임 세션입니다.',
          );
        });
      });
    });
  });
});
