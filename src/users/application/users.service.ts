import { Inject, Injectable } from '@nestjs/common';

import { IUsersRepository, USER_REPOSITORY } from '../domain/users.repository.interface';
import { User } from '../domain/users.entity';

import { UserMistakeAnalysis } from '@games/domain/user-mistake-analysis.entity';
import { GamesService } from '@games/application/games.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository: IUsersRepository,
    private readonly gamesService: GamesService,
  ) {}

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

  async getUserAnalysis(userId: bigint): Promise<UserMistakeAnalysis> {
    return this.gamesService.getUserMistakeAnalysis(userId);
  }
}
