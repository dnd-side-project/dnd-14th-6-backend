import { Test, TestingModule } from '@nestjs/testing';
import { GameStreamService } from './game-stream.service';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import {
  DIFFICULTY_SCORES,
  GAME_TIMER_DURATION,
  GameDifficultyMode,
} from '../domain/game.business-rules';
import { filter, Subject, take } from 'rxjs';
import { MessageEvent, NotFoundException } from '@nestjs/common';
import { GameProblem } from '../domain/game-problem.entity';
import {
  EndEventData,
  ProblemEventData,
  TimerEventData,
} from '../domain/game-stream-events.interface';

describe('GameStreamService', () => {
  let service: GameStreamService;
  let mockGameRepository: Partial<jest.Mocked<IGameRepository>>;

  beforeEach(async () => {
    mockGameRepository = {
      getGameCategoryProblemsByDifficulty: jest.fn(),
      getGameCategoryProblemsByRandomDifficulty: jest.fn(),
      categoryExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameStreamService,
        {
          provide: GAME_REPOSITORY,
          useValue: mockGameRepository as IGameRepository,
        },
      ],
    }).compile();

    service = module.get<GameStreamService>(GameStreamService);
  });

  describe('createGameStream()', () => {
    describe('✅ 성공 테스트 케이스', () => {
      it('게임이 시작되면, 카테고리 Git, 난이도 Easy 문제 1개를 출제하여, problem 이벤트를 발생시켜야 한다', (done) => {
        const categoryId = 1;
        const difficultyMode = GameDifficultyMode.Easy;
        const disconnectSignal$ = new Subject<void>();

        const mockProblems = [
          GameProblem.from({
            id: BigInt(categoryId),
            title: 'Git 저장소 초기화',
            subCategoryName: 'Commit',
            text: '현재 디렉토리를 Git 저장소로 초기화하는 명령어는?',
            answer: 'git init',
            point: DIFFICULTY_SCORES[difficultyMode],
            difficulty: difficultyMode,
          }),
        ];

        mockGameRepository.getGameCategoryProblemsByDifficulty!.mockResolvedValue(mockProblems);

        const stream$ = service.createGameStream(categoryId, difficultyMode, disconnectSignal$);

        stream$
          .pipe(
            filter((e) => e.type === 'problem'),
            take(1),
          )
          .subscribe({
            next: (event) => {
              const data = event.data as ProblemEventData;

              expect(data.title).toBe('Git 저장소 초기화');
              expect(data.subCategory).toBe('Commit');
              expect(data.text).toBe('현재 디렉토리를 Git 저장소로 초기화하는 명령어는?');
              expect(data.answer).toBe(Buffer.from('git init').toString('base64'));
              expect(data.point).toBe(DIFFICULTY_SCORES[difficultyMode]);
              expect(data.difficulty).toBe(difficultyMode);

              expect(mockGameRepository.getGameCategoryProblemsByDifficulty).toHaveBeenCalledWith(
                categoryId,
                difficultyMode,
              );
              expect(
                mockGameRepository.getGameCategoryProblemsByRandomDifficulty,
              ).not.toHaveBeenCalled();

              disconnectSignal$.next();
              disconnectSignal$.complete();
              done();
            },
            error: done,
          });
      });
      it('게임이 시작되면 timer 이벤트를 발생시키고, 남은시간(remainingSeconds)을 알려줘야 한다', (done) => {
        const categoryId = 1;
        const difficultyMode = GameDifficultyMode.Easy;
        const disconnectSignal$ = new Subject<void>();

        mockGameRepository.getGameCategoryProblemsByDifficulty!.mockResolvedValue([]);

        const stream$ = service.createGameStream(categoryId, difficultyMode, disconnectSignal$);

        stream$
          .pipe(
            filter((e) => e.type === 'timer'),
            take(1),
          )
          .subscribe({
            next: (event) => {
              const data = event.data as TimerEventData;
              expect(data.remainingSeconds).toBe(GAME_TIMER_DURATION);

              disconnectSignal$.next();
              disconnectSignal$.complete();
              done();
            },
            error: done,
          });
      });
      it('게임 제한시간이 종료되면 end 이벤트를 발생시키며 message를 보내줘야 한다', async () => {
        jest.useFakeTimers();

        const categoryId = 1;
        const difficultyMode = GameDifficultyMode.Easy;
        const disconnectSignal$ = new Subject<void>();

        mockGameRepository.getGameCategoryProblemsByDifficulty!.mockResolvedValue([]);

        const events: MessageEvent[] = [];
        const stream$ = service.createGameStream(categoryId, difficultyMode, disconnectSignal$);
        stream$.subscribe((event) => events.push(event));

        await jest.advanceTimersByTimeAsync(GAME_TIMER_DURATION * 1000);

        const endEvents = events.filter((e) => e.type === 'end');
        expect(endEvents).toHaveLength(1);
        expect((endEvents[0].data as EndEventData).message).toBe('게임이 종료되었습니다');

        jest.useRealTimers();
      });
    });
    describe('❌ 실패 테스트 케이스', () => {
      it('문제 조회(getGameCategoryProblemsByDifficulty) 중 DB 에러가 발생하면 스트림이 에러를 전파한다', (done) => {
        const categoryId = 1;
        const difficultyMode = GameDifficultyMode.Easy;
        const disconnectSignal$ = new Subject<void>();

        mockGameRepository.getGameCategoryProblemsByDifficulty!.mockRejectedValue(
          new Error('DB connection failed'),
        );

        const stream$ = service.createGameStream(categoryId, difficultyMode, disconnectSignal$);

        stream$.subscribe({
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('DB connection failed');
            done();
          },
        });
      });

      it('Random 모드에서 문제 조회(getGameCategoryProblemsByRandomDifficulty) 중 DB 에러가 발생하면 스트림이 에러를 전파한다', (done) => {
        const categoryId = 1;
        const difficultyMode = GameDifficultyMode.Random;
        const disconnectSignal$ = new Subject<void>();

        mockGameRepository.getGameCategoryProblemsByRandomDifficulty!.mockRejectedValue(
          new Error('DB connection failed'),
        );

        const stream$ = service.createGameStream(categoryId, difficultyMode, disconnectSignal$);

        stream$.subscribe({
          error: (err: Error) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('DB connection failed');
            expect(
              mockGameRepository.getGameCategoryProblemsByRandomDifficulty,
            ).toHaveBeenCalledWith(categoryId);
            expect(mockGameRepository.getGameCategoryProblemsByDifficulty).not.toHaveBeenCalled();
            done();
          },
        });
      });

      it('존재하지 않는 카테고리로 validateGameStreamParams를 호출하면 NotFoundException을 던진다', async () => {
        mockGameRepository.categoryExists!.mockResolvedValue(false);

        await expect(service.validateGameStreamParams(999)).rejects.toThrow(NotFoundException);
        await expect(service.validateGameStreamParams(999)).rejects.toThrow(
          '존재하지 않은 카테고리 입니다.',
        );
      });
    });
  });
});
