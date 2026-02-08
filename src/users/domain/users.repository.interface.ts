import { User } from './users.entity';

export interface ScoreDetailRaw {
  difficultyMode: string;
  category: string;
  totalScore: number;
}

export interface IUsersRepository {
  findAllOrderByScoreDesc(page: number, size: number, tierId?: number): Promise<User[]>;
  countAll(tierId?: number): Promise<number>;
  findByIdWithTier(userId: bigint): Promise<User | null>;
  getAverageScore(): Promise<number>;
  getRankingByScore(totalScore: bigint): Promise<number>;
  getScoreDetailByUserId(userId: bigint): Promise<ScoreDetailRaw[]>;
}

export const USER_REPOSITORY = Symbol('IUsersRepository');
