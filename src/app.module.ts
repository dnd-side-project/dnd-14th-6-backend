import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from '@prisma/prisma.module';
import { SseSampleModule } from '@sse-sample/sse-sample.module';
import { TiersModule } from '@tiers/tiers.module';
import { UsersModule } from '@users/users.module';
import { GamesModule } from '@games/games.module';
import { AuthModule } from '@auth/auth.module';

import { ErrorExceptionFilter } from '@common/filters/error-exception.filter';
import { TypeExceptionFilter } from '@common/filters/type-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ValidationException } from '@common/exceptions/validation.exception';

import { configSchema } from '@config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    PrismaModule,
    SseSampleModule,
    TiersModule,
    UsersModule,
    GamesModule,
    AuthModule,
  ],
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
