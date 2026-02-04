import { Module } from '@nestjs/common';

import { TiersController } from './application/tiers.controller';
import { TiersService } from './application/tiers.service';

import { TIER_REPOSITORY } from './domain/tiers.repository.interface';
import { TiersRepositoryImpl } from './infrastructure/tiers.repository';

@Module({
  controllers: [TiersController],
  providers: [
    TiersService,
    {
      provide: TIER_REPOSITORY,
      useClass: TiersRepositoryImpl,
    },
  ],
})
export class TiersModule {}
