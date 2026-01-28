import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SseSampleModule } from './sse-sample/sse-sample.module';

@Module({
  imports: [PrismaModule, SseSampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
