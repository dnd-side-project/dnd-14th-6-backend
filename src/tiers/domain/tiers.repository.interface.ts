import { Tier } from './tiers.entity';

export interface ITiersRepository {
  findAll(): Promise<Tier[]>;
}

export const TIER_REPOSITORY = Symbol('ITiersRepository');
