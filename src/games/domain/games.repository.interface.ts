import { GameCategory } from './game-categories.entity';

export const GAME_REPOSITORY = Symbol('IGameRepository');

export interface IGameRepository {
  /**
   * 모든 카테고리 목록을 조회
   * @returns 카테고리 목록 (ID 오름차순 정렬)
   */
  getCategories(): Promise<GameCategory[]>;
}
