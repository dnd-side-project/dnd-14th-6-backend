import { GameCategory } from './game-categories.entity';
import { DIFFICULTY_MODES, GameDifficultyMode } from './game.business-rules';

export class GameOptions {
  private constructor(
    readonly categories: GameCategory[],
    readonly difficultyModes: GameDifficultyMode[],
  ) {}

  static from(categories: GameCategory[]): GameOptions {
    return new GameOptions(categories, DIFFICULTY_MODES);
  }
}
