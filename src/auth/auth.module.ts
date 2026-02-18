import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GamesModule } from '@games/games.module';
import { TiersModule } from '@tiers/tiers.module';
import { UsersModule } from '@users/users.module';

import { AuthController } from './presentation/auth.controller';
import { GoogleAuthGuard } from './presentation/guards/google-auth.guard';
import { GithubAuthGuard } from './presentation/guards/github-auth.guard';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './presentation/guards/optional-jwt-auth.guard';
import { UserOwnershipGuard } from './presentation/guards/user-ownership.guard';
import { GoogleStrategy } from './presentation/strategies/google.strategy';
import { GithubStrategy } from './presentation/strategies/github.strategy';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';

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
    forwardRef(() => UsersModule),
    forwardRef(() => GamesModule),
    TiersModule,
  ],
  providers: [
    AuthService,
    AuthFacade,
    GoogleStrategy,
    GoogleAuthGuard,
    GithubStrategy,
    GithubAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    UserOwnershipGuard,
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, OptionalJwtAuthGuard, UserOwnershipGuard],
})
export class AuthModule {}
