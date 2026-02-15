import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * @description 게임 세션에 유저 ID 연동
   */
  async attachUserToSession(sessionId: bigint, userId: bigint): Promise<void> {
    const isAttached = await this.gameRepository.updateUserIdToGameSession(sessionId, userId);

    if (!isAttached) {
      throw new NotFoundException('연결할 게임 세션을 찾을 수 없습니다.');
    }
  }
}
