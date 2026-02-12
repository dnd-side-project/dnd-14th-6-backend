import { GameCategory } from './game-categories.entity';
import { GameSessionHistoryFilterEntity } from './game-session-history-filter.entity';
import { GameSessionHistoryList } from './game-session-history.entity';

export const GAME_REPOSITORY = Symbol('IGameRepository');

export interface IGameRepository {
  /**
   * @description 모든 카테고리 목록을 조회
   */
  getCategories(): Promise<GameCategory[]>;

  /**
   * @description 필터 기반 사용자 게임 세션 히스토리 목록 조회
   */
  getSessionHistoryByFilter(
    filter: GameSessionHistoryFilterEntity,
  ): Promise<GameSessionHistoryList>;
}
