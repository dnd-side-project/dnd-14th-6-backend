import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { IUsersRepository, ScoreDetailOriginData } from '../domain/users.repository.interface';
import { User } from '../domain/users.entity';

@Injectable()
export class UsersRepositoryImpl implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllOrderByScoreDesc(page: number, size: number, tierId?: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: tierId ? { tierId } : {},
      skip: (page - 1) * size,
      take: size,
      orderBy: { totalScore: 'desc' },
      include: { tier: true },
    });

    return users.map((user) => User.from(user));
  }

  async countAll(tierId?: number): Promise<number> {
    return this.prisma.user.count({ where: tierId ? { tierId } : {} });
  }

  /**
   * @description userId의 해당하는 tier 정보를 조회
   */
  async findByIdWithTier(userId: bigint): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tier: true },
    });

    if (!user) {
      return null;
    }

    return User.from(user);
  }

  /**
   * @description 전체 유저의 totalScore average 조회, 유저가 없을 경우 0 반환
   */
  async getAverageScore(): Promise<bigint> {
    const result = await this.prisma.user.aggregate({
      _avg: { totalScore: true },
    });

    const avgScore = result._avg.totalScore ?? 0;
    return BigInt(Math.round(avgScore));
  }

  /**
   * @description 유저의 총 점수 기반 현재 랭킹 조회
   */
  async getRankingByScore(totalScore: bigint): Promise<number> {
    const count = await this.prisma.user.count({
      where: { totalScore: { gt: totalScore } },
    });

    return count + 1;
  }

  /**
   * @description 유저의 플레이한 난이도, 카테고리 별 그룹화하여 획득한 총 점수(SUM)와 카테고리 정보를 조회
   * FIXME: 해당 로직은 게임 모듈 내로 이동 후 facade pattern 을 사용하는 방향으로 리팩터링 필요
   */
  async getScoreDetailByUserId(userId: bigint): Promise<ScoreDetailOriginData[]> {
    const results = await this.prisma.$queryRaw<
      { difficulty_mode: string; category: string; total_score: bigint }[]
    >`
      SELECT
        gs.difficulty_mode,
        c.name as category,
        SUM(gs.score) as total_score
      FROM game_sessions gs
      JOIN categories c ON gs.category_id = c.id
      WHERE gs.user_id = ${userId}
      GROUP BY gs.difficulty_mode, c.name
      ORDER BY gs.difficulty_mode, total_score DESC
    `;

    return results.map((row) => ({
      difficultyMode: row.difficulty_mode,
      category: row.category,
      totalScore: row.total_score,
    }));
  }
}
