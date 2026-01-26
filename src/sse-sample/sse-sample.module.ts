import { Module } from '@nestjs/common';
import { SseSampleController } from './sse-sample.controller';

@Module({
  controllers: [SseSampleController],
})
export class SseSampleModule {}
