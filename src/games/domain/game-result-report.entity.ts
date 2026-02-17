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

  /**
   * @description 비회원 열람 제한 문제 리포트 생성
   * - problemId, subCategory만 노출하고 나머지 필드는 잠금 처리
   */
  toLocked(): GameResultProblemReport {
    return new GameResultProblemReport(
      this.problemId,
      this.subCategory,
      null,
      null,
      [],
      null,
      null,
      null,
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

  /**
   * @description 비회원 열람 제한 요약 생성
   * - sessionId, userId만 노출하고 나머지 필드는 잠금 처리
   */
  toGuestView(): GameResultSummary {
    return new GameResultSummary(this.sessionId, this.userId, null, null, null, null);
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

  /**
   * @description 비회원 열람 제한 적용
   * - summary: 점수/문제수/정답률 잠금
   * - reports: maxViewableProblems 이후 문제는 잠금 처리
   */
  toGuestView(maxViewableProblems: number): GameResultReport {
    const guestSummary = this.summary.toGuestView();
    const guestReports = this.reports.map((report, index) =>
      index < maxViewableProblems ? report : report.toLocked(),
    );

    return new GameResultReport(this.isGuest, guestSummary, guestReports);
  }
}
