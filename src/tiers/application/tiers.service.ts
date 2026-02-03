import { Inject, Injectable } from '@nestjs/common';

import { ITiersRepository } from '../domain/tiers.repository.interface';
import { Tier } from '../domain/tiers.entity';

@Injectable()
export class TiersService {
  constructor(
    @Inject(ITiersRepository)
    private readonly tiersRepository: ITiersRepository,
  ) {}

  async getAllTiers(): Promise<Tier[]> {
    return this.tiersRepository.findAll();
  }
}
