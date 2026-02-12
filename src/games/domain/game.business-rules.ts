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
