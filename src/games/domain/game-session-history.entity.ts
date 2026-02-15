export class GameSessionHistory {
  private constructor(
    public readonly id: bigint,
    public readonly title: string,
    public readonly category: string,
    public readonly difficultyMode: string,
    public readonly score: number,
    public readonly totalProblemCount: number,
    public readonly correctProblemCount: number,
    public readonly playedAt: Date,
  ) {}

  static from(
    data: Pick<
      GameSessionHistory,
      'id' | 'difficultyMode' | 'score' | 'totalProblemCount' | 'correctProblemCount' | 'playedAt'
    > & { category: { name: string }; gameSessionLogs: Array<{ problem: { title: string } }> },
  ) {
    const title = this.generateTitle(data.gameSessionLogs, data.totalProblemCount);

    return new GameSessionHistory(
      data.id,
      title,
      data.category.name,
      data.difficultyMode,
      data.score,
      data.totalProblemCount,
      data.correctProblemCount,
      data.playedAt,
    );
  }

  private static generateTitle(
    logs: Array<{ problem: { title: string } }>,
    totalCount: number,
  ): string {
    if (logs.length === 0) return '';

    const firstProblemTitle = logs[0].problem.title;
    if (totalCount === 1) return firstProblemTitle;

    return `${firstProblemTitle} 외 ${totalCount - 1}건`;
  }
}

export class GameSessionHistoryList {
  private constructor(
    public readonly sessionHistories: GameSessionHistory[],
    public readonly totalItems: number,
  ) {}

  static from(data: {
    sessionHistories: GameSessionHistory[];
    totalItems: number;
  }): GameSessionHistoryList {
    return new GameSessionHistoryList(data.sessionHistories, data.totalItems);
  }
}
