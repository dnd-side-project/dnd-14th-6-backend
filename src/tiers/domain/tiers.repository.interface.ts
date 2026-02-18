import { Tier } from './tiers.entity';

export interface ITiersRepository {
  findAll(): Promise<Tier[]>;
  findLowestTier(): Promise<Tier | null>;
}

export const TIER_REPOSITORY = Symbol('ITiersRepository');
