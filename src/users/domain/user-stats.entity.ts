import { Tier } from '@tiers/domain/tiers.entity';

export class CategoryScore {
  constructor(
    public readonly category: string,
    public readonly score: number,
  ) {}

  static from(data: Pick<CategoryScore, 'category' | 'score'>): CategoryScore {
    return new CategoryScore(data.category, data.score);
  }
}

export class DifficultyScoreDetail {
  constructor(
    public readonly difficultyMode: string,
    public readonly totalScore: number,
    public readonly categoryScores: CategoryScore[],
  ) {}

  static from(
    data: Pick<DifficultyScoreDetail, 'difficultyMode' | 'totalScore' | 'categoryScores'>,
  ): DifficultyScoreDetail {
    return new DifficultyScoreDetail(data.difficultyMode, data.totalScore, data.categoryScores);
  }
}

export class UserStats {
  constructor(
    public readonly nickname: string,
    public readonly totalScore: bigint,
    public readonly averageScore: number,
    public readonly ranking: number,
    public readonly tier: Tier | null,
    public readonly scoreDetail: DifficultyScoreDetail[],
  ) {}

  static from(
    data: Pick<
      UserStats,
      'nickname' | 'totalScore' | 'averageScore' | 'ranking' | 'tier' | 'scoreDetail'
    >,
  ): UserStats {
    return new UserStats(
      data.nickname,
      data.totalScore,
      data.averageScore,
      data.ranking,
      data.tier,
      data.scoreDetail,
    );
  }
}
