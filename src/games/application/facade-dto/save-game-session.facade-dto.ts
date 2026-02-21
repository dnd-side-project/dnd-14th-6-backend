import { ClientAnswer } from '../../domain/game-client-answers.interface';
import { GameDifficultyMode } from '../../domain/game.business-rules';

export interface SaveGameSessionFacadeRequestDto {
  categoryId: number;
  difficultyMode: GameDifficultyMode;
  score: number;
  clientAnswers: ClientAnswer[];
  userId?: bigint;
}

export interface SaveGameSessionFacadeResponseDto {
  gameSessionId: bigint;
  totalScore?: bigint;
}
