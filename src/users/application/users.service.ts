import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IncrementTotalScoreMapper } from '../domain/increment-total-score.mapper';
import { RankScope } from '../domain/user.business-rule';
import { User } from '../domain/users.entity';
import { IUsersRepository, USER_REPOSITORY } from '../domain/users.repository.interface';
import { GetUserStatsServiceResponseDto } from './service-dto/get-user-stats.service-dto';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private readonly usersRepository: IUsersRepository) {}

  /**
   * @description id로 유저 정보 조회
   */
  async findById(userId: bigint): Promise<User> {
    const user = await this.usersRepository.findByIdWithTier(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    return User.from(user);
  }

  async getRanksByPageAndSize(
    page: number,
    size: number,
    scope: RankScope,
    userId?: bigint,
  ): Promise<[User[], number]> {
    if (scope === RankScope.Tier && !userId) {
      throw new ForbiddenException('티어 랭킹 조회는 회원만 가능합니다.');
    }

    const tierId =
      scope === RankScope.Tier && userId
        ? ((await this.findById(userId)).tierId ?? undefined)
        : undefined;

    return Promise.all([
      this.usersRepository.findAllOrderByScoreDesc(page, size, tierId),
      this.usersRepository.countAll(tierId),
    ]);
  }

  /**
   * @description 이메일로 유저 조회
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  /**
   * @description userId로 유저 존재 여부 조회
   */
  async isExistUser(userId: bigint): Promise<boolean> {
    const isExist = await this.usersRepository.isExistUser(userId);

    return isExist;
  }

  /**
   * @description 소셜 정보로 유저 생성
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
    return this.usersRepository.createSocialUser(socialUser);
  }

  /**
   * @description 유저 리프레시 토큰 업데이트
   */
  async updateRefreshToken(userId: bigint, refreshToken: string): Promise<User> {
    return this.usersRepository.updateRefreshToken(userId, refreshToken);
  }

  /**
   * @description 유저의 totalScore 증분 업데이트
   */
  async incrementTotalScore(
    userId: bigint,
    scoreToAdd: bigint,
  ): Promise<IncrementTotalScoreMapper> {
    return await this.usersRepository.incrementTotalScore(userId, scoreToAdd);
  }

  /**
   * @description 유저의 tierId 업데이트
   */
  async updateTierId(userId: bigint, tierId: number): Promise<void> {
    await this.usersRepository.updateTierId(userId, tierId);
  }

  /**
   * @description 유저의 랭킹, 티어, 총 점수, 카테고리 별 누적점수를 조회
   */
  async getUserStats(userId: bigint): Promise<GetUserStatsServiceResponseDto> {
    const [user, avgScore] = await Promise.all([
      this.usersRepository.findByIdWithTier(userId),
      this.usersRepository.getAverageScore(),
    ]);

    if (!user) {
      throw new NotFoundException(`존재하지 않는 사용자입니다.`);
    }

    const ranking = await this.usersRepository.getRankingByScore(user.totalScore);

    return {
      user: User.from(user),
      avgScore,
      ranking,
    };
  }
}
