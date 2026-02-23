import { User } from '../../domain/users.entity';

export interface GetUserStatsServiceResponseDto {
  user: User;
  totalUserCount: number;
  ranking: number;
}
