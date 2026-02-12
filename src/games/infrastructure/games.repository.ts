import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IGameRepository, NonRandomGameDifficultyMode } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';
import { GameProblem } from '../domain/game-problem.entity';
import {
  DIFFICULTY_SCORES,
  GameDifficultyMode,
  MAX_PROBLEMS_PER_GAME,
  ProblemDifficulty,
} from '../domain/game.business-rules';
import { capitalize } from '@common/utils/string.util';
import { ProblemRawRow } from './types/problem-raw-row';
import { ClientAnswerInput } from '../domain/game-client-answers.interface';

@Injectable()
export class GameRepositoryImpl implements IGameRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description 게임난이도 - Easy / Normal / Hard 선택시
   *
   * - 사용자가 선택한 '카테고리' 와 '게임 난이도' 에 맞춘 문제 20개 출제
   * - 예를들어 '게임 난이도'를 'Easy'를 선택했다면, 문제도 'Easy' 문제 출제
   */
  async getGameCategoryProblemsByDifficulty(
    categoryId: number,
    difficulty: NonRandomGameDifficultyMode,
  ): Promise<GameProblem[]> {
    return await this.findGameProblemsByGameOptions(categoryId, difficulty);
  }

  /**
   * @description 게임난이도 - 랜덤(Random) 선택시
   *
   * - 사용자가 선택한 '카테고리'의 '문제 난이도'는 Easy/Normal/Hard 무작위로 20개 출제
   */
  async getGameCategoryProblemsByRandomDifficulty(categoryId: number): Promise<GameProblem[]> {
    return await this.findGameProblemsByGameOptions(categoryId);
  }

  /**
   * @description 게임옵션에 맞는 20문제 출제 쿼리 (Raw Query 사용)
   */
  private async findGameProblemsByGameOptions(
    categoryId: number,
    gameDifficultyMode?: GameDifficultyMode,
  ): Promise<GameProblem[]> {
    const difficultyFilter = gameDifficultyMode
      ? Prisma.sql`AND p.difficulty = ${gameDifficultyMode.toUpperCase()}::"Difficulty"`
      : Prisma.empty;

    const problems = await this.prisma.$queryRaw<ProblemRawRow[]>`
      SELECT 
        p.id, 
        p.title, 
        p.text, 
        p.answer, 
        p.difficulty,
        sc.name as "subCategoryName"
      FROM problems p
      JOIN sub_categories sc ON p.sub_category_id = sc.id
      WHERE p.category_id = ${categoryId} ${difficultyFilter}
      ORDER BY RANDOM()
      LIMIT ${MAX_PROBLEMS_PER_GAME}
    `;

    return problems.map((p) => this.mapToGameProblem(p));
  }

  private mapToGameProblem(p: ProblemRawRow): GameProblem {
    const difficulty = capitalize(p.difficulty.toLowerCase()) as ProblemDifficulty;
    const point = DIFFICULTY_SCORES[difficulty];

    return GameProblem.from({
      id: BigInt(p.id),
      title: p.title,
      subCategoryName: p.subCategoryName,
      text: p.text,
      answer: p.answer,
      point: point,
      difficulty: difficulty,
    });
  }

  /**
   * @description 카테고리 존재여부 확인
   */
  async categoryExists(categoryId: number): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    return category !== null;
  }

  /**
   * @description 문제 ID 목록으로 문제 조회
   */
  async findProblemsByIds(problemIds: bigint[]): Promise<GameProblem[]> {
    const problems = await this.prisma.problem.findMany({
      where: { id: { in: problemIds } },
      include: { subCategory: { select: { name: true } } },
    });

    return problems.map((p) =>
      this.mapToGameProblem({
        id: p.id,
        title: p.title,
        text: p.text,
        answer: p.answer,
        difficulty: p.difficulty,
        subCategoryName: p.subCategory.name,
      }),
    );
  }

  /**
   * @description 게임 세션과 세션 로그를 원자적으로 저장
   */
  async saveGameSession(data: {
    categoryId: number;
    difficultyMode: string;
    score: number;
    totalProblemCount: number;
    correctProblemCount: number;
    logs: {
      problemId: bigint;
      inputs: ClientAnswerInput[];
      isSolved: boolean;
      tryCount: number;
    }[];
  }): Promise<bigint> {
    const session = await this.prisma.$transaction(async (tx) => {
      const gameSession = await tx.gameSession.create({
        data: {
          categoryId: data.categoryId,
          difficultyMode: data.difficultyMode,
          score: data.score,
          totalProblemCount: data.totalProblemCount,
          correctProblemCount: data.correctProblemCount,
        },
      });

      if (data.logs.length > 0) {
        await tx.gameSessionLog.createMany({
          data: data.logs.map((log) => ({
            sessionId: gameSession.id,
            problemId: log.problemId,
            inputs: log.inputs.map(({ input, isCorrect }) => ({ input, isCorrect })),
            isSolved: log.isSolved,
            tryCount: log.tryCount,
          })),
        });
      }

      return gameSession;
    });

    return session.id;
  }

  /**
   * @description 모든 학습 카테고리 목록을 조회
   */
  async getCategories(): Promise<GameCategory[]> {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return categories.map((category) => GameCategory.from(category));
  }
}
