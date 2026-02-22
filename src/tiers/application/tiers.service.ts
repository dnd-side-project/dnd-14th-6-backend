import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Tier } from '../domain/tiers.entity';
import { ITiersRepository, TIER_REPOSITORY } from '../domain/tiers.repository.interface';

@Injectable()
export class TiersService {
  constructor(
    @Inject(TIER_REPOSITORY)
    private readonly tiersRepository: ITiersRepository,
  ) {}

  async getAllTiers(): Promise<Tier[]> {
    return this.tiersRepository.findAll();
  }

  /**
   * @description 가장 낮은 기본 티어 정보 조회
   */
  async getLowestTier(): Promise<Tier> {
    const lowestTier = await this.tiersRepository.findLowestTier();
    if (!lowestTier) {
      throw new NotFoundException('기본 티어 정보를 찾을 수 없습니다.');
    }

    return lowestTier;
  }

  /**
   * @description 유저의 totalScore 점수에 해당하는 가장 높은 티어 조회
   */
  async findTierByUserTotalScore(score: bigint): Promise<Tier> {
    const tier = await this.tiersRepository.findTierByUserTotalScore(score);
    if (!tier) {
      throw new NotFoundException('티어 정보를 찾을 수 없습니다.');
    }

    return tier;
  }
}
