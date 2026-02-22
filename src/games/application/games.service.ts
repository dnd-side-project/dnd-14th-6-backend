import { Inject, Injectable } from '@nestjs/common';

import { GameOptions } from '../domain/game-options.entity';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';

@Injectable()
export class GamesService {
  constructor(@Inject(GAME_REPOSITORY) private readonly gameRepository: IGameRepository) {}

  /**
   * @description 게임옵션(카테고리, 게임난이도) 목록 조회
   * - 게임난이도: Easy | Normal | Hard | Random
   */
  async getGameOptions(): Promise<GameOptions> {
    const categories = await this.gameRepository.getCategories();
    return GameOptions.from(categories);
  }
}
