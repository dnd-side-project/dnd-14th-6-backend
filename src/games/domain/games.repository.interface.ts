import { GameCategory } from './game-categories.entity';
import { GameProblem } from './game-problem.entity';
import { GameDifficultyMode } from './game.business-rules';

export type NonRandomGameDifficultyMode = Exclude<GameDifficultyMode, GameDifficultyMode.Random>;

export const GAME_REPOSITORY = Symbol('IGameRepository');

export interface IGameRepository {
  /**
   * @description 게임난이도 - Easy / Normal / Hard 선택시
   *
   * - 사용자가 선택한 '카테고리' 와 '게임 난이도' 에 맞춘 문제 20개 출제
   * - 예를들어 '게임 난이도'를 'Easy'를 선택했다면, 문제도 'Easy' 문제 출제
   */
  getProblems(categoryId: number, difficulty: NonRandomGameDifficultyMode): Promise<GameProblem[]>;
  /**
   * @description 게임난이도 - 랜덤(Random) 선택시
   *
   * - 사용자가 선택한 '카테고리'의 '문제 난이도'는 Easy/Normal/Hard 무작위로 20개 출제
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
