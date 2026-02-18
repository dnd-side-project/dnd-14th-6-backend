import { GameCategory } from './game-categories.entity';
import { ClientAnswerInput } from './game-client-answers.interface';
import { GameProblem } from './game-problem.entity';
import { GameResultReport } from './game-result-report.entity';
import { GameSessionHistoryFilterEntity } from './game-session-history-filter.entity';
import { GameSessionHistoryList } from './game-session-history.entity';
import { GameDifficultyMode } from './game.business-rules';
import { FrequentWrongCategory, FrequentWrongCommand } from './user-mistake-analysis.entity';

export type NonRandomGameDifficultyMode = Exclude<GameDifficultyMode, GameDifficultyMode.Random>;

export const GAME_REPOSITORY = Symbol('IGameRepository');

export interface IGameRepository {
  /**
   * @description 게임난이도 - Easy / Normal / Hard 선택시
   *
   * - 사용자가 선택한 '카테고리' 와 '게임 난이도' 에 맞춘 문제 20개 출제
   * - 예를들어 '게임 난이도'를 'Easy'를 선택했다면, 문제도 'Easy' 문제 출제
   */
  getGameCategoryProblemsByDifficulty(
    categoryId: number,
    difficulty: NonRandomGameDifficultyMode,
  ): Promise<GameProblem[]>;

  /**
   * @description 게임난이도 - 랜덤(Random) 선택시
   *
   * - 사용자가 선택한 '카테고리'의 '문제 난이도'는 Easy/Normal/Hard 무작위로 20개 출제
   */
  getGameCategoryProblemsByRandomDifficulty(categoryId: number): Promise<GameProblem[]>;

  /**
   * @description 모든 카테고리 목록을 조회
   */
  getCategories(): Promise<GameCategory[]>;

  /**
   * @description categoryId로 카테고리 존재여부 확인
   */
  categoryExists(categoryId: number): Promise<boolean>;
  /**
   * @description 문제 ID 목록으로 문제 조회
   */
  findProblemsByIds(problemIds: bigint[]): Promise<GameProblem[]>;
  /**
   * @description 게임 세션과 세션 로그를 원자적으로 저장
   * @returns 생성된 GameSession ID
   */
  saveGameSession(data: {
    categoryId: number;
    difficultyMode: GameDifficultyMode;
    score: number;
    totalProblemCount: number;
    correctProblemCount: number;
    logs: {
      problemId: bigint;
      inputs: ClientAnswerInput[];
      isSolved: boolean;
      tryCount: number;
    }[];
  }): Promise<bigint>;

  /**
   * @description 필터 기반 사용자 게임 세션 히스토리 목록 조회
   */
  getSessionHistoryByFilter(
    filter: GameSessionHistoryFilterEntity,
  ): Promise<GameSessionHistoryList>;

  /**
   * @description 사용자가 자주 틀린 명령어 Top 5 조회 (서브 카테고리 별)
   */
  getFrequentWrongCommands(userId: bigint): Promise<FrequentWrongCommand[]>;

  /**
   * @description 사용자가 자주 틀린 카테고리 조회 (오답 비율 포함)
   */
  getFrequentWrongCategories(userId: bigint): Promise<FrequentWrongCategory[]>;
  /**
   * @description 게임 결과 리포트 조회
   */
  findGameResultReport(gameSessionId: bigint): Promise<GameResultReport | null>;
}
