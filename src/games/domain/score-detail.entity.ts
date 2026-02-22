import { ScoreDetailOriginData } from '../infrastructure/types/score-detail-origin-data';

export class CategoryScore {
  constructor(
    public readonly category: string,
    public readonly score: bigint,
  ) {}

  static from(data: Pick<CategoryScore, 'category' | 'score'>): CategoryScore {
    return new CategoryScore(data.category, data.score);
  }
}

export class DifficultyScoreDetail {
  constructor(
    public readonly difficultyMode: string,
    public readonly totalScore: bigint,
    public readonly categoryScores: CategoryScore[],
  ) {}

  static from(
    data: Pick<DifficultyScoreDetail, 'difficultyMode' | 'totalScore' | 'categoryScores'>,
  ): DifficultyScoreDetail {
    return new DifficultyScoreDetail(data.difficultyMode, data.totalScore, data.categoryScores);
  }
}

export class ScoreDetailMapper {
  /**
   * @description 난이도 별 스코어와 카테고리를 그룹화하고 점수가 높은 순으로 정렬
   */
  static groupAndSortScoreDetail(
    scoreDetailOriginData: ScoreDetailOriginData[],
  ): DifficultyScoreDetail[] {
    const difficultyModeGroup = new Map<
      string,
      { totalScore: bigint; categories: CategoryScore[] }
    >();

    for (const detail of scoreDetailOriginData) {
      const existing = difficultyModeGroup.get(detail.difficultyMode);
      const categoryScore = CategoryScore.from({
        category: detail.category,
        score: detail.totalScore,
      });

      if (existing) {
        existing.totalScore = existing.totalScore + detail.totalScore;
        existing.categories.push(categoryScore);
      } else {
        difficultyModeGroup.set(detail.difficultyMode, {
          totalScore: detail.totalScore,
          categories: [categoryScore],
        });
      }
    }

    const result: DifficultyScoreDetail[] = [];
    for (const [difficultyMode, data] of difficultyModeGroup) {
      const sortedCategories = data.categories.sort((a, b) => Number(b.score - a.score));
      result.push(
        DifficultyScoreDetail.from({
          difficultyMode,
          totalScore: data.totalScore,
          categoryScores: sortedCategories,
        }),
      );
    }

    return result.sort((a, b) => Number(b.totalScore - a.totalScore));
  }
}
