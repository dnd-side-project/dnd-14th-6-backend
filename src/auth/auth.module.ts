import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GamesModule } from '@games/games.module';
import { TiersModule } from '@tiers/tiers.module';
import { UsersModule } from '@users/users.module';

import { AuthController } from './presentation/auth.controller';
import { GoogleAuthGuard } from './presentation/guards/google-auth.guard';
import { GithubAuthGuard } from './presentation/guards/github-auth.guard';
import { GoogleStrategy } from './presentation/strategies/google.strategy';
import { GithubStrategy } from './presentation/strategies/github.strategy';

import { AuthFacade } from './application/auth.facade';
import { AuthService } from './application/auth.service';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_TOKEN_SECRET'),
      }),
    }),
    UsersModule,
    GamesModule,
    TiersModule,
  ],
  providers: [
    AuthService,
    AuthFacade,
    GoogleStrategy,
    GoogleAuthGuard,
    GithubStrategy,
    GithubAuthGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
