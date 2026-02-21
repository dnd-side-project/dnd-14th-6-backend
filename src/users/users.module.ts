import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';

import { GamesModule } from '@games/games.module';

import { UsersService } from './application/users.service';
import { USER_REPOSITORY } from './domain/users.repository.interface';
import { UsersRepositoryImpl } from './infrastructure/users.repository';
import { UsersController } from './presentation/users.controller';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => GamesModule)],
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
