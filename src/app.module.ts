import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AuthModule } from '@auth/auth.module';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsModule } from 'nestjs-cls';

import { ValidationException } from '@common/exceptions/validation.exception';
import { ErrorExceptionFilter } from '@common/filters/error-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { TypeExceptionFilter } from '@common/filters/type-exception.filter';
import { configSchema } from '@config/config.schema';
import { GamesModule } from '@games/games.module';
import { PrismaModule } from '@prisma/prisma.module';
import { PrismaService } from '@prisma/prisma.service';
import { SseSampleModule } from '@sse-sample/sse-sample.module';
import { TiersModule } from '@tiers/tiers.module';
import { UsersModule } from '@users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
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
