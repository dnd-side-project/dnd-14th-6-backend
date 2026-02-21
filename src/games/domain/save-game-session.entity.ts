import { ClientAnswerInput } from './game-client-answers.interface';
import { GameDifficultyMode } from './game.business-rules';

export class SaveGameSessionLog {
  private constructor(
    public readonly problemId: bigint,
    public readonly inputs: ClientAnswerInput[],
    public readonly isSolved: boolean,
    public readonly tryCount: number,
  ) {}

  static from(data: {
    problemId: bigint;
    inputs: ClientAnswerInput[];
    isSolved: boolean;
    tryCount: number;
  }): SaveGameSessionLog {
    return new SaveGameSessionLog(data.problemId, data.inputs, data.isSolved, data.tryCount);
  }
}

export class SaveGameSessionEntity {
  private constructor(
    public readonly categoryId: number,
    public readonly difficultyMode: GameDifficultyMode,
    public readonly score: number,
    public readonly userId: bigint | undefined,
    public readonly totalProblemCount: number,
    public readonly correctProblemCount: number,
    public readonly logs: SaveGameSessionLog[],
  ) {}

  static from(data: {
    categoryId: number;
    difficultyMode: GameDifficultyMode;
    score: number;
    userId?: bigint;
    totalProblemCount: number;
    correctProblemCount: number;
    logs: SaveGameSessionLog[];
  }): SaveGameSessionEntity {
    return new SaveGameSessionEntity(
      data.categoryId,
      data.difficultyMode,
      data.score,
      data.userId,
      data.totalProblemCount,
      data.correctProblemCount,
      data.logs,
    );
  }
}
