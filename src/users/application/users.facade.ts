import { Injectable } from '@nestjs/common';

import { GameAnalyticsService } from '@games/application/game-analytics.service';
import { UserMistakeAnalysis } from '@games/domain/user-mistake-analysis.entity';

import { UserStats } from '../domain/user-stats.entity';
import { UsersService } from './users.service';

@Injectable()
export class UsersFacade {
  constructor(
    private readonly gameAnalyticsService: GameAnalyticsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * @description 유저의 실수(많이 틀린 카테고리, 자주 틀린 명령어) 분석 조회
   */
  async getUserAnalysis(userId: bigint): Promise<UserMistakeAnalysis> {
    return this.gameAnalyticsService.getUserMistakeAnalysis(userId);
  }

  /**
   * @description 유저의 랭킹, 티어, 총 점수, 카테고리 별 누적점수를 조회
   */
  async getUserStats(userId: bigint): Promise<UserStats> {
    const [scoreDetail, userStatsSource] = await Promise.all([
      this.gameAnalyticsService.getScoreDetailByUserId(userId),
      this.usersService.getUserStats(userId),
    ]);

    return UserStats.from({
      nickname: userStatsSource.user.nickname,
      totalScore: userStatsSource.user.totalScore,
      percentile: (userStatsSource.ranking / userStatsSource.totalUserCount) * 100,
      ranking: userStatsSource.ranking,
      tier: userStatsSource.user.tier,
      scoreDetail,
    });
  }
}
