import { GameCategory } from './game-categories.entity';
import { GameProblem } from './game-problem.entity';
import { GameDifficultyMode } from './game.business-rules';

type NonRandomGameDifficultyMode = Exclude<GameDifficultyMode, GameDifficultyMode.Random>;

export const GAME_REPOSITORY = Symbol('IGameRepository');

export interface IGameRepository {
  /**
   * @description 특정 카테고리와 난이도에 맞는 문제 MAX_PROBLEMS_PER_GAME개 랜덤으로 출제
   */
  getProblems(categoryId: number, difficulty: NonRandomGameDifficultyMode): Promise<GameProblem[]>;
  /**
   * @description 특정 카테고리의 난이도가 랜덤으로 문제 MAX_PROBLEMS_PER_GAME개 랜덤으로 출제
   */
  getRandomProblems(categoryId: number): Promise<GameProblem[]>;
  /**
   * @description 모든 카테고리 목록을 조회
   */
  getCategories(): Promise<GameCategory[]>;
  /**
   * @description categoryId로 카테고리 존재여부 확인
   */
  categoryExists(categoryId: number): Promise<boolean>;
}
