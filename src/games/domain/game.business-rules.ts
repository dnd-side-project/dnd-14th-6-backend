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

/** 게임 제한 시간 (초) - 60초 후 게임 종료 */
export const GAME_TIMER_DURATION = 60;

/** 게임당 최대 출제 문제 수 */
export const MAX_PROBLEMS_PER_GAME = 20;

/** 문제 출제 최소 간격 (ms) */
export const PROBLEM_INTERVAL_MIN = 1000;

/** 문제 출제 최대 간격 (ms) - 게임 시간 내 전체 문제 전송을 보장하기 위해 여유분 포함 (2400ms) */
export const PROBLEM_INTERVAL_MAX = Math.floor(
  (GAME_TIMER_DURATION * 1000 * 0.8) / MAX_PROBLEMS_PER_GAME,
);

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
