import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  GameResultProblemReport,
  GameResultReport,
  GameResultSummary,
} from '../domain/game-result-report.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
import { GameSessionSortBy, SortOrder } from '../domain/game.business-rules';
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
    const createMockGameResultReport = (userId: bigint | null): GameResultReport => {
      const summary = GameResultSummary.from({
        sessionId: 7n,
        userId,
        score: 30,
        totalProblemCount: 20,
        correctProblemCount: 3,
      });

      const reports = [
        GameResultProblemReport.from({
          problemId: 73n,
          subCategory: 'Remote',
          text: '등록된 원격 저장소의 이름만 확인하는 명령어는?',
          explanation: '`git remote`는 등록된 원격 저장소의 이름(별칭)만 간단히 나열합니다.',
          inputs: [
            { input: 'git branch', isCorrect: false },
            { input: 'git remote', isCorrect: true },
          ],
          answer: 'git remote',
          isSolved: true,
          tryCount: 2,
        }),
      ];

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
          const expectedReport = createMockGameResultReport(1n);
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
            NotFoundException,
          );
          await expect(service.getGameResultReport(gameSessionId)).rejects.toThrow(
            '존재하지 않는 게임 세션입니다.',
          );
        });
      });
    });

    describe('비회원용', () => {
      describe('✅ 성공 케이스', () => {
        it('비회원 게임 결과 리포트를 정상적으로 반환한다.', async () => {
          const gameSessionId = 7n;
          const expectedReport = createMockGameResultReport(null);
          gameRepository.findGameResultReport.mockResolvedValue(expectedReport);

          // FIXME: 비회원용 테스트케이스 작성
          // - 일부 데이터 열람 제한부분 반영
          const result = await service.getGameResultReport(gameSessionId);

          expect(result).toEqual(expectedReport);
          expect(result.isGuest).toBe(true);
          expect(result.summary.userId).toBeNull();
          expect(gameRepository.findGameResultReport).toHaveBeenCalledWith(gameSessionId);
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
