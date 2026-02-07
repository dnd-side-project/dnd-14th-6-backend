import { User } from './users.entity';

export interface IUsersRepository {
  findAllOrderByScoreDesc(page: number, size: number, tierId?: number): Promise<User[]>;
  countAll(tierId?: number): Promise<number>;
}

export const USER_REPOSITORY = Symbol('IUsersRepository');
