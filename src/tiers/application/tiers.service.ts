import { Inject, Injectable } from '@nestjs/common';

import { ITiersRepository, TIER_REPOSITORY } from '../domain/tiers.repository.interface';
import { Tier } from '../domain/tiers.entity';

@Injectable()
export class TiersService {
  constructor(
    @Inject(TIER_REPOSITORY)
    private readonly tiersRepository: ITiersRepository,
  ) {}

  async getAllTiers(): Promise<Tier[]> {
    return this.tiersRepository.findAll();
  }
}
