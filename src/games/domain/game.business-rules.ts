/**
 * 게임 난이도 선택
 */
export enum GameDifficultyMode {
  Easy = 'Easy',
  Normal = 'Normal',
  Hard = 'Hard',
  Random = 'Random',
}
export const DIFFICULTY_MODES: GameDifficultyMode[] = Object.values(GameDifficultyMode);

/**
 * 문제 난이도 (Easy, Normal, Hard)
 */
export type ProblemDifficulty = 'Easy' | 'Normal' | 'Hard';

/**
 * 문제 난이도 배점
 * {@link DIFFICULTY_SCORES} 상수에 구현되어 있습니다.
 */
export const DIFFICULTY_SCORES: Readonly<Record<ProblemDifficulty, number>> = {
  Easy: 10,
  Normal: 30,
  Hard: 50,
} as const;

/**
 * 서버 측 점수 계산: solved된 문제의 난이도별 배점 합산
 */
export function calculateServerScore(solvedProblemDifficulties: ProblemDifficulty[]): number {
  return solvedProblemDifficulties.reduce(
    (total, difficulty) => total + DIFFICULTY_SCORES[difficulty],
    0,
  );
}

/** 게임 제한 시간 (초) - 60초 후 게임 종료 */
export const GAME_TIMER_DURATION = 60;

/** 게임당 최대 출제 문제 수 */
export const MAX_PROBLEMS_PER_GAME = 20;

/** 비회원 게임 결과 문제 해설(report) 열람 가능 문제 수 */
export const GUEST_MAX_VIEWABLE_PROBLEMS = 10;

/** 문제 출제 최소 간격 (ms) */
export const PROBLEM_INTERVAL_MIN = 2000;

/** 마지막 문제 풀이를 위한 최소 보장 시간 (초) */
export const MIN_TIME_FOR_LAST_PROBLEM = 5;

/**
 * 문제 출제 최대 간격 (ms)
 *
 * - 마지막 문제 도착 후 최소 {@link MIN_TIME_FOR_LAST_PROBLEM}초의 답변 여유를 보장합니다.
 * - 계산: ({@link GAME_TIMER_DURATION} - {@link MIN_TIME_FOR_LAST_PROBLEM}) * 1000 / {@link MAX_PROBLEMS_PER_GAME}
 * - 실제 랜덤 범위: [{@link PROBLEM_INTERVAL_MIN}, {@link PROBLEM_INTERVAL_MAX})
 */
export const PROBLEM_INTERVAL_MAX =
  ((GAME_TIMER_DURATION - MIN_TIME_FOR_LAST_PROBLEM) * 1000) / MAX_PROBLEMS_PER_GAME;

/**
 * 게임 세션 히스토리 정렬 기준
 */
export enum GameSessionSortBy {
  PlayedAt = 'playedAt',
  Score = 'score',
  CorrectProblemCount = 'correctProblemCount',
}

/**
 * 정렬 방향
 */
export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}
