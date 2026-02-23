import { DifficultyScoreDetail } from '@games/domain/score-detail.entity';
import { Tier } from '@tiers/domain/tiers.entity';

export { CategoryScore, DifficultyScoreDetail } from '@games/domain/score-detail.entity';

export class UserStats {
  constructor(
    public readonly nickname: string,
    public readonly totalScore: bigint,
    public readonly percentile: number,
    public readonly ranking: number,
    public readonly tier: Tier | null,
    public readonly scoreDetail: DifficultyScoreDetail[],
  ) {}

  static from(
    data: Pick<
      UserStats,
      'nickname' | 'totalScore' | 'percentile' | 'ranking' | 'tier' | 'scoreDetail'
    >,
  ): UserStats {
    return new UserStats(
      data.nickname,
      data.totalScore,
      data.percentile,
      data.ranking,
      data.tier,
      data.scoreDetail,
    );
  }
}
