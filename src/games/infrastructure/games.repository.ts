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

@Injectable()
export class GameRepositoryImpl implements IGameRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description 특정 카테고리와 난이도에 맞는 문제 MAX_PROBLEMS_PER_GAME 개만큼 랜덤으로 출제
   */
  async getProblems(
    categoryId: number,
    difficulty: NonRandomGameDifficultyMode,
  ): Promise<GameProblem[]> {
    return await this.findRandomProblems(categoryId, difficulty);
  }

  /**
   * @description 특정 카테고리의 난이도가 랜덤으로 문제 MAX_PROBLEMS_PER_GAME 개 만큼 랜덤으로 출제
   */
  async getRandomProblems(categoryId: number): Promise<GameProblem[]> {
    return await this.findRandomProblems(categoryId);
  }

  /**
   * @description 랜덤 문제 조회 로직 (Raw Query 사용)
   */
  private async findRandomProblems(
    categoryId: number,
    difficulty?: GameDifficultyMode,
  ): Promise<GameProblem[]> {
    const difficultyFilter = difficulty
      ? Prisma.sql`AND p.difficulty = ${difficulty.toUpperCase()}::"Difficulty"`
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
    const difficulty = capitalize(p.difficulty.toLowerCase()) as GameDifficultyMode;
    const point = DIFFICULTY_SCORES[difficulty as ProblemDifficulty];

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
