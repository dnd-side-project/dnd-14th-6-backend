import { Injectable } from '@nestjs/common';

import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { PrismaService } from '@prisma/prisma.service';

import { IncrementTotalScoreMapper } from '../domain/increment-total-score.mapper';
import { User } from '../domain/users.entity';
import { IUsersRepository } from '../domain/users.repository.interface';

@Injectable()
export class UsersRepositoryImpl implements IUsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

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
   * @description 이메일로 유저 조회
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { tier: true },
    });

    if (!user) {
      return null;
    }

    return User.from(user);
  }

  /**
   * @description 소셜 로그인 유저 생성
   */
  async createSocialUser(socialUser: {
    email: string;
    nickname: string;
    provider: string;
    providerId: string;
    profileImage: string | null;
    githubUrl: string | null;
    refreshToken: string;
    tierId: number;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: socialUser,
      include: { tier: true },
    });

    return User.from(user);
  }

  /**
   * @description 리프레시 토큰 업데이트
   */
  async updateRefreshToken(userId: bigint, refreshToken: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
      include: { tier: true },
    });

    return User.from(user);
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
   * @description count 활용 존재하는 유저인지 확인
   */
  async isExistUser(userId: bigint): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id: userId } });

    return count > 0;
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

  /*
   * @description 유저의 totalScore 증분 업데이트
   * - @Transactional() 컨텍스트 내에서 호출 시 해당 트랜잭션에 참여
   */
  async incrementTotalScore(
    userId: bigint,
    scoreToAdd: bigint,
  ): Promise<IncrementTotalScoreMapper> {
    const user = await this.txHost.tx.user.update({
      where: { id: userId },
      data: { totalScore: { increment: scoreToAdd } },
      select: { totalScore: true, tierId: true },
    });
    return IncrementTotalScoreMapper.from({ totalScore: user.totalScore, tierId: user.tierId });
  }

  /**
   * @description 유저의 tierId 업데이트
   * - @Transactional() 컨텍스트 내에서 호출 시 해당 트랜잭션에 참여
   */
  async updateTierId(userId: bigint, tierId: number): Promise<void> {
    await this.txHost.tx.user.update({
      where: { id: userId },
      data: { tierId },
    });
  }
}
