import { Module } from '@nestjs/common';
import { GamesService } from '@/games/application/games.service';
import { GamesController } from '@/games/presentation/games.controller';
import { GAME_REPOSITORY } from '@games/domain/games.repository.interface';
import { GameRepository } from '@games/infra-structure/games.repository';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    GamesService,
    {
      provide: GAME_REPOSITORY,
      useClass: GameRepository,
    },
  ],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
