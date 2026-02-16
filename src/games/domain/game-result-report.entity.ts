import { ClientAnswerInput } from './game-client-answers.interface';

export class GameResultProblemReport {
  private constructor(
    public readonly problemId: bigint,
    public readonly subCategory: string,
    public readonly text: string | null,
    public readonly explanation: string | null,
    public readonly inputs: ClientAnswerInput[],
    public readonly answer: string | null,
    public readonly isSolved: boolean | null,
    public readonly tryCount: number | null,
  ) {}

  static from(
    data: Pick<
      GameResultProblemReport,
      | 'problemId'
      | 'subCategory'
      | 'text'
      | 'explanation'
      | 'inputs'
      | 'answer'
      | 'isSolved'
      | 'tryCount'
    >,
  ) {
    return new GameResultProblemReport(
      data.problemId,
      data.subCategory,
      data.text,
      data.explanation,
      data.inputs,
      data.answer,
      data.isSolved,
      data.tryCount,
    );
  }
}

export class GameResultSummary {
  private constructor(
    public readonly sessionId: bigint,
    public readonly userId: bigint | null,
    public readonly score: number | null,
    public readonly totalProblemCount: number | null,
    public readonly correctProblemCount: number | null,
    public readonly correctRate: number | null,
  ) {}

  static from(
    data: Pick<
      GameResultSummary,
      'sessionId' | 'userId' | 'score' | 'totalProblemCount' | 'correctProblemCount'
    >,
  ) {
    const correctRate =
      data.totalProblemCount == null
        ? null
        : data.totalProblemCount > 0
          ? Math.round(((data.correctProblemCount ?? 0) / data.totalProblemCount) * 100)
          : 0;

    return new GameResultSummary(
      data.sessionId,
      data.userId,
      data.score,
      data.totalProblemCount,
      data.correctProblemCount,
      correctRate,
    );
  }
}

export class GameResultReport {
  private constructor(
    public readonly isGuest: boolean,
    public readonly summary: GameResultSummary,
    public readonly reports: GameResultProblemReport[],
  ) {}

  static from(data: {
    isGuest: boolean;
    summary: GameResultSummary;
    reports: GameResultProblemReport[];
  }) {
    return new GameResultReport(data.isGuest, data.summary, data.reports);
  }
}
