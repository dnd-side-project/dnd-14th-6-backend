export class IncrementTotalScoreMapper {
  private constructor(
    public readonly totalScore: bigint,
    public readonly tierId: number | null,
  ) {}

  static from(data: Pick<IncrementTotalScoreMapper, 'totalScore' | 'tierId'>) {
    return new IncrementTotalScoreMapper(data.totalScore, data.tierId);
  }
}
