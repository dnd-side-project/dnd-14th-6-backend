import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { GamesService } from './application/games.service';
import { GameSessionService } from './application/game-session.service';
import { GamesController } from './presentation/games.controller';
import { GAME_REPOSITORY } from './domain/games.repository.interface';
import { GameRepositoryImpl } from './infrastructure/games.repository';
import { GameStreamService } from './application/game-stream.service';

@Module({
  imports: [PrismaModule],
  providers: [
    GamesService,
    GameStreamService,
    GameSessionService,
    {
      provide: GAME_REPOSITORY,
      useClass: GameRepositoryImpl,
    },
  ],
  controllers: [GamesController],
  exports: [GamesService, GameSessionService],
})
export class GamesModule {}
