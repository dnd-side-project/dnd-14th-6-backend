import { Module } from '@nestjs/common';

import { TiersController } from './application/tiers.controller';
import { TiersService } from './application/tiers.service';

import { ITiersRepository } from './domain/tiers.repository.interface';
import { TiersRepositoryImpl } from './infrastructure/tiers.repository';

@Module({
  controllers: [TiersController],
  providers: [
    TiersService,
    {
      provide: ITiersRepository,
      useClass: TiersRepositoryImpl,
    },
  ],
})
export class TiersModule {}
