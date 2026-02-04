import { Inject, Injectable } from '@nestjs/common';
import { GAME_REPOSITORY, IGameRepository } from '@games/domain/games.repository.interface';
import { GameOptions } from '@games/domain/game-options.entity';

@Injectable()
export class GamesService {
  constructor(@Inject(GAME_REPOSITORY) private readonly gameRepository: IGameRepository) {}

  async getGameOptions(): Promise<GameOptions> {
    const categories = await this.gameRepository.getCategories();
    return GameOptions.from(categories);
  }
}
