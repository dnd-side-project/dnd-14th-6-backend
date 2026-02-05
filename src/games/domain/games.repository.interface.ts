import { GameCategory } from './game-categories.entity';

export const GAME_REPOSITORY = Symbol('IGameRepository');

export interface IGameRepository {
  /**
   * @description 모든 카테고리 목록을 조회
   */
  getCategories(): Promise<GameCategory[]>;
}
