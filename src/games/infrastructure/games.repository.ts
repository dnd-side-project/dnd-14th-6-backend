import { PrismaService } from '@prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IGameRepository } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';
import {
  FrequentWrongCommand,
  FrequentWrongCategory,
} from '../domain/user-mistake-analysis.entity';

@Injectable()
export class GameRepositoryImpl implements IGameRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 모든 학습 카테고리 목록을 조회
   * ID 오름차순으로 정렬하여 반환
   * @returns 학습 카테고리 ID와 이름 목록
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
   * @description 사용자가 자주 틀린 명령어 Top 5 조회 (서브 카테고리 별)
   * - 오답(isSolved=false)만 집계
   * - 오답 횟수가 많은 순으로 정렬 후 상위 5개만 반환
   */
  async getFrequentWrongCommands(userId: bigint): Promise<FrequentWrongCommand[]> {
    const result = await this.prisma.$queryRaw<Array<{ subCategory: string; wrongCount: bigint }>>`
      SELECT
        sc.name as "subCategory",
        COUNT(*) as "wrongCount"
      FROM game_session_logs gsl
      JOIN game_sessions gs ON gsl.session_id = gs.id
      JOIN problems p ON gsl.problem_id = p.id
      JOIN sub_categories sc ON p.sub_category_id = sc.id
      WHERE gsl.is_solved = false AND gs.user_id = ${userId}
      GROUP BY sc.id, sc.name
      ORDER BY "wrongCount" DESC
      LIMIT 5
    `;

    return result.map((row) =>
      FrequentWrongCommand.from({
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
        c.name as category,
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
