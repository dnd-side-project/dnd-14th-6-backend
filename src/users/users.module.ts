import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { GamesModule } from '@games/games.module';

import { UsersController } from './presentation/users.controller';
import { UsersService } from './application/users.service';

import { USER_REPOSITORY } from './domain/users.repository.interface';
import { UsersRepositoryImpl } from './infrastructure/users.repository';

@Module({
  imports: [forwardRef(() => AuthModule), GamesModule],
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
