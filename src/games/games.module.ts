import { Module } from '@nestjs/common';
import { GamesService } from './application/games.service';
import { GamesController } from './presentation/games.controller';
import { GAME_REPOSITORY } from './domain/games.repository.interface';
import { GameRepositoryImpl } from './infrastructure/games.repository';
import { PrismaModule } from '@prisma/prisma.module';
import { GameStreamService } from './application/game-stream.service';

@Module({
  imports: [PrismaModule],
  providers: [
    GamesService,
    GameStreamService,
    {
      provide: GAME_REPOSITORY,
      useClass: GameRepositoryImpl,
    },
  ],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
