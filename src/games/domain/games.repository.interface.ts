import { GameCategory } from './game-categories.entity';
import { FrequentWrongCommand, FrequentWrongCategory } from './user-mistake-analysis.entity';

export const GAME_REPOSITORY = Symbol('IGameRepository');

export interface IGameRepository {
  /**
   * @description 모든 카테고리 목록을 조회
   */
  getCategories(): Promise<GameCategory[]>;

  /**
   * @description 사용자가 자주 틀린 명령어 Top 5 조회 (서브 카테고리 별)
   */
  getFrequentWrongCommands(userId: bigint): Promise<FrequentWrongCommand[]>;

  /**
   * @description 사용자가 자주 틀린 카테고리 조회 (오답 비율 포함)
   */
  getFrequentWrongCategories(userId: bigint): Promise<FrequentWrongCategory[]>;
}
