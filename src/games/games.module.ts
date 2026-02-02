import { Module } from '@nestjs/common';
import { GamesService } from '@games/domain/games.service';
import { GamesController } from '@games/application/games.controller';
import { GAME } from '@games/domain/games.repository.interface';
import { GameRepository } from '@games/infra-structure/games.repository';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    GamesService,
    {
      provide: GAME,
      useClass: GameRepository,
    },
  ],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
