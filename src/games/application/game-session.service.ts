import { Inject, Injectable } from '@nestjs/common';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';

@Injectable()
export class GameSessionService {
  constructor(@Inject(GAME_REPOSITORY) private readonly gameRepository: IGameRepository) {}

  async getSessionHistories(
    filter: GameSessionHistoryFilterEntity,
  ): Promise<GameSessionHistoryList> {
    return this.gameRepository.getSessionHistoryByFilter(filter);
  }
}
