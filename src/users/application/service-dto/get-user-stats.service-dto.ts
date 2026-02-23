import { User } from '../../domain/users.entity';

export interface GetUserStatsServiceResponseDto {
  user: User;
  avgScore: bigint;
  ranking: number;
}
