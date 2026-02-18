import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { ITiersRepository } from '../domain/tiers.repository.interface';
import { Tier } from '../domain/tiers.entity';

@Injectable()
export class TiersRepositoryImpl implements ITiersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Tier[]> {
    const tiers = await this.prisma.tier.findMany({
      orderBy: { minScore: 'asc' },
    });

    return tiers.map((tier) => Tier.from(tier));
  }

  /**
   * @description 가장 낮은 티어 조회
   */
  async findLowestTier(): Promise<Tier | null> {
    const tier = await this.prisma.tier.findFirst({
      orderBy: { minScore: 'asc' },
    });

    if (!tier) {
      return null;
    }

    return Tier.from(tier);
  }
}
