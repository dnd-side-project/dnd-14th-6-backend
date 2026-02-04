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
