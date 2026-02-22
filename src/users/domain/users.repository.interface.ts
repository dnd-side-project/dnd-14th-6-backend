import { IncrementTotalScoreMapper } from './increment-total-score.mapper';
import { User } from './users.entity';

export interface ScoreDetailOriginData {
  difficultyMode: string;
  category: string;
  totalScore: bigint;
}

export interface IUsersRepository {
  findAllOrderByScoreDesc(page: number, size: number, tierId?: number): Promise<User[]>;
  countAll(tierId?: number): Promise<number>;
  findByEmail(email: string): Promise<User | null>;
  createSocialUser(socialUser: {
    email: string;
    nickname: string;
    provider: string;
    providerId: string;
    profileImage: string | null;
    githubUrl: string | null;
    refreshToken: string;
    tierId: number;
  }): Promise<User>;
  updateRefreshToken(userId: bigint, refreshToken: string): Promise<User>;
  findByIdWithTier(userId: bigint): Promise<User | null>;
  isExistUser(userId: bigint): Promise<boolean>;
  getAverageScore(): Promise<bigint>;
  getRankingByScore(totalScore: bigint): Promise<number>;
  getScoreDetailByUserId(userId: bigint): Promise<ScoreDetailOriginData[]>;
  incrementTotalScore(userId: bigint, scoreToAdd: bigint): Promise<IncrementTotalScoreMapper>;
  updateTierId(userId: bigint, tierId: number): Promise<void>;
}

export const USER_REPOSITORY = Symbol('IUsersRepository');
