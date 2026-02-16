import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { GamesService } from '@games/application/games.service';
import { UserMistakeAnalysis } from '@games/domain/user-mistake-analysis.entity';

import { UserStats } from '../domain/user-stats.entity';
import { UserStatsMapper } from '../domain/user-stats.mapper';
import { User } from '../domain/users.entity';
import { IUsersRepository, USER_REPOSITORY } from '../domain/users.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository: IUsersRepository,
    private readonly gamesService: GamesService,
  ) {}

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
    tierId?: number,
  ): Promise<[User[], number]> {
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

  // FIXME: user facade 도입을 통해 도메인 결합 분리되도록 리팩터링 필요
  async getUserAnalysis(userId: bigint): Promise<UserMistakeAnalysis> {
    return this.gamesService.getUserMistakeAnalysis(userId);
  }

  /**
   * @description 유저의 랭킹, 티어, 총 점수, 카테고리 별 누적점수를 조회
   */
  async getUserStats(userId: bigint): Promise<UserStats> {
    const [user, avgScore, scoreDetailOriginData] = await Promise.all([
      this.usersRepository.findByIdWithTier(userId),
      this.usersRepository.getAverageScore(),
      this.usersRepository.getScoreDetailByUserId(userId),
    ]);

    // FIXME: auth guard 추가 시 필요 없어짐 (guard에서 리소스 확인)
    if (!user) {
      throw new NotFoundException(`존재하지 않는 유저입니다.`);
    }

    const ranking = await this.usersRepository.getRankingByScore(user.totalScore);
    const scoreDetail = UserStatsMapper.groupAndSortScoreDetail(scoreDetailOriginData);

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
