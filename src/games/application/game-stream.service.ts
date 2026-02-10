import { Inject, Injectable, MessageEvent, NotFoundException } from '@nestjs/common';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import {
  GAME_TIMER_DURATION,
  GameDifficultyMode,
  MAX_PROBLEMS_PER_GAME,
  PROBLEM_INTERVAL_MAX,
  PROBLEM_INTERVAL_MIN,
} from '../domain/game.business-rules';
import {
  concatMap,
  delay,
  finalize,
  from,
  map,
  merge,
  Observable,
  of,
  Subject,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import {
  EndEventData,
  ProblemEventData,
  TimerEventData,
} from '../domain/game-stream-events.interface';

@Injectable()
export class GameStreamService {
  constructor(@Inject(GAME_REPOSITORY) private readonly gameRepository: IGameRepository) {}

  /**
   * @description SSE 기반 게임 스트림 생성
   */
  createGameStream(
    categoryId: number,
    difficultyMode: GameDifficultyMode,
    disconnectSignal$: Subject<void>,
  ): Observable<MessageEvent> {
    const gameEnd$ = new Subject<void>();

    const timerStream$ = this.createTimerStream(gameEnd$, disconnectSignal$);
    const problemStream$ = this.createProblemStream(
      categoryId,
      difficultyMode,
      gameEnd$,
      disconnectSignal$,
    );

    return merge(timerStream$, problemStream$).pipe(
      finalize(() => {
        gameEnd$.complete();
      }),
    );
  }
  /**
   * @description 게임 타이머 스트림 생성
   *
   * - 1초간격으로 남은시간을 전송하고, 시간이 0이되면 게임종료 이벤트 발생
   */
  private createTimerStream(
    gameEnd$: Subject<void>,
    disconnectSignal$: Subject<void>,
  ): Observable<MessageEvent> {
    return timer(0, 1000).pipe(
      take(GAME_TIMER_DURATION + 1),
      map((tick): MessageEvent => {
        const remainingSeconds = GAME_TIMER_DURATION - tick;

        if (remainingSeconds === 0) {
          gameEnd$.next();
          gameEnd$.complete();
          return {
            type: 'end',
            data: { message: '게임이 종료되었습니다' } as EndEventData,
          };
        }

        return {
          type: 'timer',
          data: { remainingSeconds } as TimerEventData,
        };
      }),
      takeUntil(disconnectSignal$),
    );
  }
  /**
   * @description 문제 출제 스트림 생성
   *
   * - 랜덤 간격(PROBLEM_INTERVAL_MIN ~ PROBLEM_INTERVAL_MAX)으로 문제를 순차 전송
   * - 게임 종료 또는 연결 해제 시 스트림 중단
   */
  private createProblemStream(
    categoryId: number,
    difficultyMode: GameDifficultyMode,
    gameEnd$: Subject<void>,
    disconnectSignal$: Subject<void>,
  ): Observable<MessageEvent> {
    return from(this.fetchProblems(categoryId, difficultyMode)).pipe(
      concatMap((problems) => from(problems)),
      take(MAX_PROBLEMS_PER_GAME),
      concatMap((problem) => {
        const randomDelay =
          Math.floor(Math.random() * (PROBLEM_INTERVAL_MAX - PROBLEM_INTERVAL_MIN)) +
          PROBLEM_INTERVAL_MIN;
        return of(problem).pipe(delay(randomDelay));
      }),
      map((problem): MessageEvent => {
        const problemEvent: ProblemEventData = {
          problemId: problem.id.toString(),
          title: problem.title,
          subCategory: problem.subCategoryName,
          text: problem.text,
          answer: this.encodeProblemAnswer(problem.answer),
          point: problem.point,
          difficulty: problem.difficulty,
        };
        return {
          type: 'problem',
          data: problemEvent,
        };
      }),
      takeUntil(merge(gameEnd$, disconnectSignal$)),
    );
  }
  /**
   * @description 카테고리와 난이도에 맞는 문제 출제
   *
   * - Random 모드일 경우 랜덤으로 문제를 선택
   */
  private fetchProblems(categoryId: number, difficultyMode: GameDifficultyMode) {
    if (difficultyMode === GameDifficultyMode.Random) {
      return this.gameRepository.getRandomProblems(categoryId);
    }

    return this.gameRepository.getProblems(categoryId, difficultyMode);
  }
  /**
   * @description 문제 정답을 Base64로 인코딩
   */
  private encodeProblemAnswer(answer: string): string {
    return Buffer.from(answer).toString('base64');
  }
  /**
   * @description 게임 스트림 요청 파라미터 유효성 검증
   */
  async validateGameStreamParams(categoryId: number): Promise<void> {
    const categoryExists = await this.gameRepository.categoryExists(categoryId);
    if (!categoryExists) {
      throw new NotFoundException('존재하지 않은 카테고리 입니다.');
    }
  }
}
