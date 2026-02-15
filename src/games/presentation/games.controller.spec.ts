import { EventEmitter } from 'events';
import { BadRequestException, Logger, MessageEvent, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Request, Response } from 'express';
import { Observable, of, Subject, takeUntil } from 'rxjs';

import { GameSessionService } from '../application/game-session.service';
import { GameStreamService } from '../application/game-stream.service';
import { GamesService } from '../application/games.service';
import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';
import {
  GameResultProblemReport,
  GameResultReport,
  GameResultSummary,
} from '../domain/game-result-report.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
import {
  DIFFICULTY_MODES,
  GameDifficultyMode,
  GameSessionSortBy,
  SortOrder,
} from '../domain/game.business-rules';
import {
  GetGameHistoriesQueryDto,
  GetGameHistoriesResponseDto,
} from './dto/get-game-histories.dto';
import { GetGameOptionsResponseDto } from './dto/get-game-options.dto';
import { GetGameResultReportResponseDto } from './dto/get-game-result-report.dto';
import { ClientAnswerDto, InputDto, SaveGameSessionRequestDto } from './dto/save-game-session.dto';
import { GamesController } from './games.controller';

describe('GamesController', () => {
  let controller: GamesController;
  let gameService: jest.Mocked<GamesService>;
  let gameStreamService: jest.Mocked<GameStreamService>;
  let gameSessionService: jest.Mocked<GameSessionService>;

  beforeEach(async () => {
    const mockGameService = {
      getGameOptions: jest.fn(),
      createGameSession: jest.fn(),
    };
    const mockGameStreamService = {
      validateGameStreamParams: jest.fn(),
      createGameStream: jest.fn(),
    };

    const mockGameSessionService = {
      getSessionHistories: jest.fn(),
      getGameResultReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGameService,
        },
        {
          provide: GameStreamService,
          useValue: mockGameStreamService,
        },
        {
          provide: GameSessionService,
          useValue: mockGameSessionService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gameService = module.get(GamesService);
    gameStreamService = module.get(GameStreamService);
    gameSessionService = module.get(GameSessionService);
  });

  describe('getGameOptions', () => {
    it('게임옵션 정보를 정상적으로 응답한다.', async () => {
      const categories: GameCategory[] = [
        { id: 1, name: 'Git', iconUrl: 'https://fake-storage/categories/git.png' },
        { id: 2, name: 'Linux', iconUrl: 'https://fake-storage/categories/linux.png' },
        { id: 3, name: 'Docker', iconUrl: 'https://fake-storage/categories/docker.png' },
      ];
      const gameOptions = GameOptions.from(categories);
      gameService.getGameOptions.mockResolvedValue(gameOptions);

      const result = await controller.getGameOptions();

      expect(result).toBeInstanceOf(GetGameOptionsResponseDto);
      expect(result).toEqual({
        categories,
        difficultyModes: DIFFICULTY_MODES,
      });
      expect(gameService.getGameOptions).toHaveBeenCalledTimes(1);
    });
  });

  describe('getGameHistories', () => {
    const createQuery = (
      overrides?: Partial<GetGameHistoriesQueryDto>,
    ): GetGameHistoriesQueryDto => ({
      userId: 1n,
      page: 1,
      size: 10,
      sortBy: GameSessionSortBy.PlayedAt,
      sortOrder: SortOrder.Desc,
      ...overrides,
    });

    it('세션 히스토리 목록을 정상적으로 응답한다.', async () => {
      const query = createQuery();
      const historyList = GameSessionHistoryList.from({
        sessionHistories: [],
        totalItems: 0,
      });
      gameSessionService.getSessionHistories.mockResolvedValue(historyList);

      const result = await controller.getGameHistories(query);

      expect(result).toBeInstanceOf(GetGameHistoriesResponseDto);
      expect(result).toEqual({
        sessions: [],
        metadata: { page: 1, size: 10, totalItems: 0, totalPages: 0 },
      });
      expect(gameSessionService.getSessionHistories).toHaveBeenCalledWith(query);
    });
  });

  describe('gameStream', () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockResponse = {
        setHeader: jest.fn(),
        flushHeaders: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
      };
    });

    describe('✅ 성공 케이스', () => {
      it('유효한 카테고리와 난이도로 요청하면 게임 스트림을 반환한다.', async () => {
        const query = { categoryId: 1, difficultyMode: GameDifficultyMode.Easy };
        const mockRequest = new EventEmitter() as Request;

        const mockEvent: MessageEvent = { type: 'timer', data: { remainingSeconds: 60 } };
        gameStreamService.validateGameStreamParams.mockResolvedValue(undefined);
        gameStreamService.createGameStream.mockReturnValue(of(mockEvent));

        await controller.gameStream(query, mockRequest, mockResponse as Response);

        expect(gameStreamService.validateGameStreamParams).toHaveBeenCalledWith(query.categoryId);
        expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
        expect(mockResponse.flushHeaders).toHaveBeenCalled();
        expect(gameStreamService.createGameStream).toHaveBeenCalledWith(
          query.categoryId,
          query.difficultyMode,
          expect.any(Object),
        );
        expect(mockResponse.write).toHaveBeenCalledWith('event: timer\n');
        expect(mockResponse.write).toHaveBeenCalledWith(
          expect.stringContaining('"remainingSeconds":60'),
        );
        expect(mockResponse.end).toHaveBeenCalled();
      });
      it('게임 진행 중 연결이 종료되면 스트림을 중단하고 리소스를 정리한다.', async () => {
        const query = { categoryId: 1, difficultyMode: GameDifficultyMode.Easy };
        const mockRequest = new EventEmitter() as Request;

        const streamSubject = new Subject<MessageEvent>();
        gameStreamService.validateGameStreamParams.mockResolvedValue(undefined);
        gameStreamService.createGameStream.mockImplementation(
          (_categoryId, _difficultyMode, disconnectSignal$) => {
            return streamSubject.pipe(takeUntil(disconnectSignal$));
          },
        );

        await controller.gameStream(query, mockRequest, mockResponse as Response);

        // 스트림이 활성 상태에서 이벤트 정상 전송 확인
        streamSubject.next({ type: 'timer', data: { remainingSeconds: 60 } });
        expect(mockResponse.write).toHaveBeenCalledWith('event: timer\n');
        expect(mockResponse.end).not.toHaveBeenCalled();

        // 클라이언트 연결 종료 (브라우저 종료, 새로고침 등)
        mockRequest.emit('close');

        // 연결 종료 후 response.end() 호출되어 리소스 정리 확인
        expect(mockResponse.end).toHaveBeenCalled();

        // 연결 종료 후 추가 이벤트가 전송되지 않는지 확인
        (mockResponse.write as jest.Mock).mockClear();
        streamSubject.next({ type: 'timer', data: { remainingSeconds: 59 } });
        expect(mockResponse.write).not.toHaveBeenCalled();
      });
    });

    describe('❌ 실패 케이스', () => {
      it('존재하지 않는 카테고리로 요청하면 NotFoundException을 던진다.', async () => {
        const query = { categoryId: 999, difficultyMode: GameDifficultyMode.Easy };
        const mockRequest = new EventEmitter() as Request;

        gameStreamService.validateGameStreamParams.mockRejectedValue(
          new NotFoundException('존재하지 않은 카테고리 입니다.'),
        );

        await expect(
          controller.gameStream(query, mockRequest, mockResponse as Response),
        ).rejects.toThrow(NotFoundException);
        expect(mockResponse.flushHeaders).not.toHaveBeenCalled();
        expect(gameStreamService.createGameStream).not.toHaveBeenCalled();
      });
      it('스트림 도중 에러가 발생하면 Logger.error를 호출하고 연결을 종료한다.', async () => {
        const query = { categoryId: 1, difficultyMode: GameDifficultyMode.Easy };
        const mockRequest = new EventEmitter() as Request;
        const streamError = new Error('DB connection failed');

        gameStreamService.validateGameStreamParams.mockResolvedValue(undefined);
        gameStreamService.createGameStream.mockImplementation(() => {
          return new Subject<MessageEvent>().pipe((source) => {
            return new Observable((subscriber) => {
              source.subscribe(subscriber);
              subscriber.error(streamError);
            });
          });
        });

        const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

        await controller.gameStream(query, mockRequest, mockResponse as Response);

        expect(loggerSpy).toHaveBeenCalledWith(
          'Game stream error [categoryId=1, difficultyMode=Easy]',
          streamError.stack,
        );
        expect(mockResponse.end).toHaveBeenCalled();

        loggerSpy.mockRestore();
      });
    });
  });
  describe('saveGameSession', () => {
    const createDto = (): SaveGameSessionRequestDto => {
      const input = Object.assign(new InputDto(), {
        input: 'git init',
        isCorrect: true,
      });
      const clientAnswer = Object.assign(new ClientAnswerDto(), {
        problemId: '1',
        inputs: [input],
        solved: true,
      });
      return Object.assign(new SaveGameSessionRequestDto(), {
        categoryId: 1,
        difficultyMode: GameDifficultyMode.Easy,
        score: 10,
        clientAnswers: [clientAnswer],
      });
    };
    describe('회원용', () => {
      // FIXME 회원용 테스트케이스 추가
    });
    describe('비회원용', () => {
      describe('✅ 성공 케이스', () => {
        it('게임 세션을 정상 저장하고 gameSessionId를 반환한다.', async () => {
          const dto = createDto();
          gameService.createGameSession.mockResolvedValue(BigInt(100));

          const result = await controller.saveGameSession(dto);

          expect(result).toEqual({ gameSessionId: '100' });
          expect(gameService.createGameSession).toHaveBeenCalledWith({
            categoryId: dto.categoryId,
            difficultyMode: dto.difficultyMode,
            score: dto.score,
            clientAnswers: dto.clientAnswers,
          });
        });
      });
      describe('❌ 실패 케이스', () => {
        it('존재하지 않는 카테고리면 NotFoundException을 던진다.', async () => {
          const dto = createDto();
          dto.categoryId = 999;
          gameService.createGameSession.mockRejectedValue(
            new NotFoundException('존재하지 않는 카테고리입니다.'),
          );

          await expect(controller.saveGameSession(dto)).rejects.toThrow(NotFoundException);
        });

        it('중복된 problemId가 포함되어 있으면 BadRequestException을 던진다.', async () => {
          const dto = createDto();
          gameService.createGameSession.mockRejectedValue(
            new BadRequestException('clientAnswers에 중복된 problemId가 포함되어 있습니다.'),
          );

          await expect(controller.saveGameSession(dto)).rejects.toThrow(BadRequestException);
        });

        it('존재하지 않는 문제 ID가 포함되어 있으면 NotFoundException을 던진다.', async () => {
          const dto = createDto();
          gameService.createGameSession.mockRejectedValue(
            new NotFoundException('존재하지 않는 문제 ID가 포함되어 있습니다. (problemId: 999)'),
          );

          await expect(controller.saveGameSession(dto)).rejects.toThrow(NotFoundException);
        });

        it('solved=true인데 정답 처리된 입력이 없으면 BadRequestException을 던진다.', async () => {
          const dto = createDto();
          gameService.createGameSession.mockRejectedValue(
            new BadRequestException(
              '데이터 무결성 오류: solved가 true이지만 정답 처리된 입력이 없습니다.',
            ),
          );

          await expect(controller.saveGameSession(dto)).rejects.toThrow(BadRequestException);
        });
      });
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

      return GameResultReport.from({ isGuest: userId === null, summary, reports });
    };

    describe('회원용', () => {
      // FIXME: AuthGuard 이후 user_id를 매핑받아서 테스트
      describe('✅ 성공 케이스', () => {
        it('회원 게임 결과 리포트를 정상적으로 응답한다.', async () => {
          const mockReport = createMockGameResultReport(1n);
          gameSessionService.getGameResultReport.mockResolvedValue(mockReport);

          const result = await controller.getGameResultReport(7n);

          expect(result).toBeInstanceOf(GetGameResultReportResponseDto);
          expect(result.isGuest).toBe(false);
          expect(result.summary).toEqual({
            sessionId: '7',
            userId: '1',
            score: 30,
            totalProblemCount: 20,
            correctProblemCount: 3,
            correctRate: 15,
          });
          expect(result.reports).toHaveLength(1);
          expect(result.reports[0]).toEqual({
            problemId: '73',
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
          });
          expect(gameSessionService.getGameResultReport).toHaveBeenCalledWith(7n);
        });
      });

      describe('❌ 실패 케이스', () => {
        it('존재하지 않는 게임 세션 ID이면 NotFoundException을 던진다.', async () => {
          gameSessionService.getGameResultReport.mockRejectedValue(
            new NotFoundException('존재하지 않는 게임 세션입니다.'),
          );

          await expect(controller.getGameResultReport(999n)).rejects.toThrow(NotFoundException);
        });
      });
    });

    describe('비회원용', () => {
      // FIXME: 비회원용 테스트케이스 작성
      describe('✅ 성공 케이스', () => {
        it('비회원 게임 결과 리포트를 정상적으로 응답한다.', async () => {
          const mockReport = createMockGameResultReport(null);
          gameSessionService.getGameResultReport.mockResolvedValue(mockReport);

          const result = await controller.getGameResultReport(7n);

          expect(result).toBeInstanceOf(GetGameResultReportResponseDto);
          // FIXME: 이후에 열람제한되는 데이터 확인하는 테스트코드추가
          expect(result.isGuest).toBe(true);
          expect(result.summary.userId).toBeNull();
          expect(gameSessionService.getGameResultReport).toHaveBeenCalledWith(7n);
        });
      });

      describe('❌ 실패 케이스', () => {
        it('존재하지 않는 게임 세션 ID이면 NotFoundException을 던진다.', async () => {
          gameSessionService.getGameResultReport.mockRejectedValue(
            new NotFoundException('존재하지 않는 게임 세션입니다.'),
          );

          await expect(controller.getGameResultReport(999n)).rejects.toThrow(NotFoundException);
        });
      });
    });
  });
});
