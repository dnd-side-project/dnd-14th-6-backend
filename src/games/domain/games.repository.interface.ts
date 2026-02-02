import { CategoryResult } from '@games/domain/games.types';

export const GAME = Symbol('IGameRepository');

export interface IGameRepository {
  /**
   * 모든 카테고리 목록을 조회
   * @returns 카테고리 목록 (ID 오름차순 정렬)
   */
  getCategories(): Promise<CategoryResult[]>;
}
