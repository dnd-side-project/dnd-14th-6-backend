import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { capitalize } from '@common/utils/string.util';

import { IGameRepository, NonRandomGameDifficultyMode } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';
import {
  FrequentWrongCommand,
  FrequentWrongCategory,
} from '../domain/user-mistake-analysis.entity';
import { GameProblem } from '../domain/game-problem.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistory, GameSessionHistoryList } from '../domain/game-session-history.entity';
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

  /**
   * @description 사용자가 자주 틀린 명령어 Top 5 조회 (서브 카테고리 별)
   * - 오답(isSolved=false)만 집계
   * - 오답 횟수가 많은 순으로 정렬 후 상위 5개만 반환
   */
  async getFrequentWrongCommands(userId: bigint): Promise<FrequentWrongCommand[]> {
    const result = await this.prisma.$queryRaw<
      Array<{ category: string; subCategory: string; wrongCount: bigint }>
    >`
      SELECT
        c.name as "category",
        sc.name as "subCategory",
        COUNT(*) as "wrongCount"
      FROM game_session_logs gsl
      JOIN game_sessions gs ON gsl.session_id = gs.id
      JOIN problems p ON gsl.problem_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN sub_categories sc ON p.sub_category_id = sc.id
      WHERE gsl.is_solved = false AND gs.user_id = ${userId}
      GROUP BY c.id, c.name, sc.id, sc.name
      ORDER BY "wrongCount" DESC
      LIMIT 5
    `;

    return result.map((row) =>
      FrequentWrongCommand.from({
        category: row.category,
        subCategory: row.subCategory,
        wrongCount: Number(row.wrongCount),
      }),
    );
  }

  /**
   * @description 사용자가 자주 틀린 카테고리 조회 (오답 비율 포함)
   * - 카테고리별 총 시도 횟수와 오답 횟수를 집계해 오답 비율이 높은 순으로 정렬
   */
  async getFrequentWrongCategories(userId: bigint): Promise<FrequentWrongCategory[]> {
    const result = await this.prisma.$queryRaw<
      Array<{ category: string; wrongRatio: number; wrongCount: bigint; iconUrl: string | null }>
    >`
      SELECT
        c.name as "category",
        c.icon_url as "iconUrl",
        COUNT(CASE WHEN gsl.is_solved = false THEN 1 END) as "wrongCount",
        ROUND(
          (COUNT(CASE WHEN gsl.is_solved = false THEN 1 END)::numeric /
           NULLIF(COUNT(*), 0) * 100),
          0
        ) as "wrongRatio"
      FROM game_session_logs gsl
      JOIN game_sessions gs ON gsl.session_id = gs.id
      JOIN problems p ON gsl.problem_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE gs.user_id = ${userId}
      GROUP BY c.id, c.name, c.icon_url
      HAVING COUNT(*) > 0
      ORDER BY "wrongRatio" DESC
    `;

    return result.map((row) =>
      FrequentWrongCategory.from({
        category: row.category,
        wrongRatio: Number(row.wrongRatio),
        wrongCount: Number(row.wrongCount),
        iconUrl: row.iconUrl,
      }),
    );
  }
}
