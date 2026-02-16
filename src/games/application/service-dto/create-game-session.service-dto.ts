import { ClientAnswer } from '../../domain/game-client-answers.interface';
import { GameDifficultyMode } from '../../domain/game.business-rules';

export interface CreateGameSessionServiceRequestDto {
  categoryId: number;
  difficultyMode: GameDifficultyMode;
  score: number;
  clientAnswers: ClientAnswer[];
}
