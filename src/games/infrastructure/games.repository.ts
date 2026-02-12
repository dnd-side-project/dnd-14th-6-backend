import { PrismaService } from '@prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IGameRepository } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistory, GameSessionHistoryList } from '../domain/game-session-history.entity';

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
   * @description 필터 기반 게임 세션 히스토리 목록 조회
   * 필터 별 where, sort 등의 동적 쿼리 지원
   */
  async getSessionHistoryByFilter(
    filter: GameSessionHistoryFilterEntity,
  ): Promise<GameSessionHistoryList> {
    const query = this.buildSessionHistoryFilterQuery(filter);

    const [sessions, totalCount] = await this.prisma.$transaction([
      this.prisma.gameSession.findMany({
        ...query,
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
      this.prisma.gameSession.count({ where: query.where }),
    ]);

    const sessionHistories = sessions.map((session) => GameSessionHistory.from(session));

    return GameSessionHistoryList.from({
      sessionHistories,
      totalItems: totalCount,
    });
  }

  /**
   * @description 세션 히스토리 조회용 동적 필터 쿼리 생성
   * where, orderBy, skip, take를 한 번에 구성
   */
  private buildSessionHistoryFilterQuery(filter: GameSessionHistoryFilterEntity) {
    const where: Prisma.GameSessionWhereInput = {
      userId: filter.userId,
    };

    if (filter.startDate || filter.endDate) {
      where.playedAt = {
        ...(filter.startDate && { gte: new Date(filter.startDate) }),
        ...(filter.endDate && { lt: new Date(filter.endDate + 'T23:59:59.999Z') }),
      };
    }

    if (filter.categories?.length) {
      where.category = { name: { in: filter.categories } };
    }

    if (filter.difficultyModes?.length) {
      where.difficultyMode = { in: filter.difficultyModes };
    }

    if (filter.search) {
      where.gameSessionLogs = {
        some: {
          problem: {
            OR: [
              { text: { contains: filter.search, mode: 'insensitive' } },
              { answer: { contains: filter.search, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    return {
      where,
      orderBy: { [filter.sortBy]: filter.sortOrder },
      skip: (filter.page - 1) * filter.size,
      take: filter.size,
    };
  }
}
