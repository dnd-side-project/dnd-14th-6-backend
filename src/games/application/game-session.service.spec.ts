import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  GameResultProblemReport,
  GameResultReport,
  GameResultSummary,
} from '../domain/game-result-report.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
import {
  GameSessionSortBy,
  GUEST_MAX_VIEWABLE_PROBLEMS,
  SortOrder,
} from '../domain/game.business-rules';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameSessionService } from './game-session.service';

describe('GameSessionService', () => {
  let service: GameSessionService;
  let gameRepository: jest.Mocked<
    Pick<IGameRepository, 'getSessionHistoryByFilter' | 'findGameResultReport'>
  >;

  beforeEach(async () => {
    const mockGameRepository = {
      getSessionHistoryByFilter: jest.fn(),
      findGameResultReport: jest.fn(),
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
          }
        });

        it(`비회원은 문제 ${GUEST_MAX_VIEWABLE_PROBLEMS + 1} 이후 데이터가 잠금 처리된다.`, async () => {
          const gameSessionId = 7n;
          const mockReport = createMockGameResultReport(null);
          gameRepository.findGameResultReport.mockResolvedValue(mockReport);

          const result = await service.getGameResultReport(gameSessionId);
          const lockedReports = result.reports.slice(GUEST_MAX_VIEWABLE_PROBLEMS);

          for (const report of lockedReports) {
            expect(report.problemId).toBeDefined();
            expect(report.subCategory).toBeDefined();
            expect(report.text).toBeNull();
            expect(report.explanation).toBeNull();
            expect(report.inputs).toEqual([]);
            expect(report.answer).toBeNull();
            expect(report.isSolved).toBeNull();
            expect(report.tryCount).toBeNull();
          }
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
