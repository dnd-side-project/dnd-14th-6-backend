import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';

import { PrismaModule } from '@prisma/prisma.module';
import { TiersModule } from '@tiers/tiers.module';
import { UsersModule } from '@users/users.module';

import { GameAnalyticsService } from './application/game-analytics.service';
import { GameSessionService } from './application/game-session.service';
import { GameStreamService } from './application/game-stream.service';
import { GameFacade } from './application/game.facade';
import { GamesService } from './application/games.service';
import { GAME_REPOSITORY } from './domain/games.repository.interface';
import { GameRepositoryImpl } from './infrastructure/games.repository';
import { GamesController } from './presentation/games.controller';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule, forwardRef(() => UsersModule), TiersModule],
  providers: [
    GameFacade,
    GameAnalyticsService,
    GamesService,
    GameStreamService,
    GameSessionService,
    {
      provide: GAME_REPOSITORY,
      useClass: GameRepositoryImpl,
    },
  ],
  controllers: [GamesController],
  exports: [GameAnalyticsService, GamesService, GameSessionService],
})
export class GamesModule {}
