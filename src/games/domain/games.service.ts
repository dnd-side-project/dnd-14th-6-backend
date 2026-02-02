import { Inject, Injectable } from '@nestjs/common';
import { GAME, IGameRepository } from '@games/domain/games.repository.interface';
import { DIFFICULTY_MODES } from '@games/domain/game.business-rules';

@Injectable()
export class GamesService {
  constructor(@Inject(GAME) private readonly gameRepository: IGameRepository) {}

  async getGameOptions() {
    const categories = await this.gameRepository.getCategories();

    return {
      categories,
      difficultyModes: DIFFICULTY_MODES,
    };
  }
}
