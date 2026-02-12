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

/** 문제 출제 최소 간격 (ms) */
export const PROBLEM_INTERVAL_MIN = 1000;

/** 문제 출제 최대 간격 (ms) - 게임 시간 내 전체 문제 전송을 보장하기 위해 여유분 포함 (2400ms) */
export const PROBLEM_INTERVAL_MAX = Math.floor(
  (GAME_TIMER_DURATION * 1000 * 0.8) / MAX_PROBLEMS_PER_GAME,
);
