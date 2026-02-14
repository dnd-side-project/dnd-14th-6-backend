import { Module } from '@nestjs/common';
import { GamesModule } from '@games/games.module';

import { UsersController } from './presentation/users.controller';
import { UsersService } from './application/users.service';

import { USER_REPOSITORY } from './domain/users.repository.interface';
import { UsersRepositoryImpl } from './infrastructure/users.repository';

@Module({
  imports: [GamesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: UsersRepositoryImpl,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
