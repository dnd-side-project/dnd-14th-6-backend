import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IUsersRepository, USER_REPOSITORY } from '../domain/users.repository.interface';
import { User } from '../domain/users.entity';
import { UserStats } from '../domain/user-stats.entity';
import { UserStatsMapper } from '../domain/user-stats.mapper';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private readonly usersRepository: IUsersRepository) {}

  async getRanksByPageAndSize(
    page: number,
    size: number,
    tierId?: number,
  ): Promise<[User[], number]> {
    return Promise.all([
      this.usersRepository.findAllOrderByScoreDesc(page, size, tierId),
      this.usersRepository.countAll(tierId),
    ]);
  }

  /**
   * @description 유저의 랭킹, 티어, 총 점수, 카테고리 별 누적점수를 조회
   */
  async getUserStats(userId: bigint): Promise<UserStats> {
    const [user, avgScore, scoreDetailRaw] = await Promise.all([
      this.usersRepository.findByIdWithTier(userId),
      this.usersRepository.getAverageScore(),
      this.usersRepository.getScoreDetailByUserId(userId),
    ]);

    // FIXME: auth guard 추가 시 필요 없어짐 (guard에서 리소스 확인)
    if (!user) {
      throw new NotFoundException(`존재하지 않는 유저입니다.`);
    }

    const ranking = await this.usersRepository.getRankingByScore(user.totalScore);
    const scoreDetail = UserStatsMapper.groupAndSortScoreDetail(scoreDetailRaw);

    return UserStats.from({
      nickname: user.nickname,
      totalScore: user.totalScore,
      averageScore: avgScore,
      ranking,
      tier: user.tier,
      scoreDetail,
    });
  }
}
