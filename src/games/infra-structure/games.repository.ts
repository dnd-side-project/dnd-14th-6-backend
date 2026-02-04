import { PrismaService } from '@prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IGameRepository } from '../domain/games.repository.interface';
import { GameCategory } from '../domain/game-categories.entity';

@Injectable()
export class GameRepository implements IGameRepository {
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
}
