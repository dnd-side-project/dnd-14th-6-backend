import { Inject, Injectable } from '@nestjs/common';

import { IUsersRepository, USER_REPOSITORY } from '../domain/users.repository.interface';
import { User } from '../domain/users.entity';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private readonly usersRepository: IUsersRepository) {}

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
}
