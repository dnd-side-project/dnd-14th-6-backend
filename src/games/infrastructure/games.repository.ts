import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { capitalize } from '@common/utils/string.util';

import { GameCategory } from '../domain/game-categories.entity';
import { GameProblem } from '../domain/game-problem.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistory, GameSessionHistoryList } from '../domain/game-session-history.entity';
import { IGameRepository, NonRandomGameDifficultyMode } from '../domain/games.repository.interface';
import {
  DIFFICULTY_SCORES,
  GameDifficultyMode,
  MAX_PROBLEMS_PER_GAME,
  ProblemDifficulty,
} from '../domain/game.business-rules';

import { ProblemRawRow } from './types/problem-raw-row';

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

  /**
   * @description 필터 기반 게임 세션 히스토리 목록 조회
   * 필터 별 where, sort 등의 동적 쿼리 지원
   */
  async getSessionHistoryByFilter(
    filter: GameSessionHistoryFilterEntity,
  ): Promise<GameSessionHistoryList> {
    const sessionHistoryQueryArgs = this.buildGameSessionHistoryListQueryArgs(filter);

    const [sessions, totalCount] = await this.prisma.$transaction([
      this.prisma.gameSession.findMany({
        ...sessionHistoryQueryArgs,
        include: {
          category: {
            select: { name: true },
          },
          gameSessionLogs: {
            take: 1,
            select: {
              problem: {
                select: { title: true },
              },
            },
            orderBy: { id: 'asc' },
          },
        },
      }),
      this.prisma.gameSession.count({ where: sessionHistoryQueryArgs.where }),
    ]);

    const sessionHistories = sessions.map((session) => GameSessionHistory.from(session));

    return GameSessionHistoryList.from({
      sessionHistories,
      totalItems: totalCount,
    });
  }

  private buildGameSessionHistoryListQueryArgs(filter: GameSessionHistoryFilterEntity) {
    const where = this.buildGameSessionHistoryFilterWhereClause(filter);

    return {
      where,
      orderBy: { [filter.sortBy]: filter.sortOrder },
      skip: (filter.page - 1) * filter.size,
      take: filter.size,
    };
  }

  private buildGameSessionHistoryFilterWhereClause(
    filter: GameSessionHistoryFilterEntity,
  ): Prisma.GameSessionWhereInput {
    const where: Prisma.GameSessionWhereInput = {
      userId: filter.userId,
    };

    const playedAtDateRange = this.buildGameSessionHistoryPlayedAtDateRange(filter);

    if (playedAtDateRange) {
      where.playedAt = playedAtDateRange;
    }

    if (filter.categories?.length) {
      where.category = { name: { in: filter.categories } };
    }

    if (filter.difficultyModes?.length) {
      where.difficultyMode = { in: filter.difficultyModes };
    }

    const searchKeyword = filter.search?.trim();

    if (searchKeyword) {
      where.gameSessionLogs = {
        some: {
          problem: {
            OR: [
              { text: { contains: searchKeyword, mode: 'insensitive' } },
              { answer: { contains: searchKeyword, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    return where;
  }

  private buildGameSessionHistoryPlayedAtDateRange(
    filter: GameSessionHistoryFilterEntity,
  ): Prisma.DateTimeFilter | undefined {
    if (!filter.startDate && !filter.endDate) {
      return undefined;
    }

    const playedAtDateRange: Prisma.DateTimeFilter = {};

    if (filter.startDate) {
      playedAtDateRange.gte = new Date(`${filter.startDate}T00:00:00.000Z`);
    }

    if (filter.endDate) {
      const endDateExclusive = new Date(`${filter.endDate}T00:00:00.000Z`);
      endDateExclusive.setUTCDate(endDateExclusive.getUTCDate() + 1);
      playedAtDateRange.lt = endDateExclusive;
    }

    return playedAtDateRange;
  }
}
