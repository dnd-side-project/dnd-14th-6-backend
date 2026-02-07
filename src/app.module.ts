import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from '@prisma/prisma.module';
import { SseSampleModule } from '@sse-sample/sse-sample.module';
import { TiersModule } from '@tiers/tiers.module';
import { ErrorExceptionFilter } from '@common/filters/error-exception.filter';
import { TypeExceptionFilter } from '@common/filters/type-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ValidationException } from '@common/exceptions/validation.exception';
import { GamesModule } from '@games/games.module';

@Module({
  imports: [PrismaModule, SseSampleModule, TiersModule, GamesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        exceptionFactory: (errors) => ValidationException.badRequest(errors),
      }),
    },
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
