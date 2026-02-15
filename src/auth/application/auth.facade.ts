import { Injectable } from '@nestjs/common';

import { GameSessionService } from '@games/application/game-session.service';
import { TiersService } from '@tiers/application/tiers.service';
import { UsersService } from '@users/application/users.service';

import {
  processSocialLoginRequestDto,
  ProcessSocialLoginResponseDto,
} from './service-dto/process-social-login.service-dto';

import { AuthService } from './auth.service';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly gameSessionService: GameSessionService,
    private readonly tiersService: TiersService,
  ) {}

  /**
   * @description 소셜 로그인 처리 서비스 함수
   */
  async processSocialLogin(
    loginData: processSocialLoginRequestDto,
  ): Promise<ProcessSocialLoginResponseDto> {
    const existingUser = await this.usersService.findByEmail(loginData.socialUser.email);

    if (existingUser) {
      return this.loginExistingUser(existingUser.id);
    }

    return this.registerNewSocialUser(loginData);
  }

  private async loginExistingUser(userId: bigint): Promise<ProcessSocialLoginResponseDto> {
    const tokens = this.authService.issueTokens(userId);

    await this.usersService.updateRefreshToken(userId, tokens.refreshToken);

    return {
      ...tokens,
    };
  }

  private async registerNewSocialUser(
    loginData: processSocialLoginRequestDto,
  ): Promise<ProcessSocialLoginResponseDto> {
    const refreshToken = this.authService.createRefreshToken();
    const lowestTier = await this.tiersService.getLowestTier();

    const createdUser = await this.usersService.createSocialUser({
      email: loginData.socialUser.email,
      nickname: loginData.socialUser.nickname,
      provider: loginData.provider,
      providerId: loginData.socialUser.id,
      profileImage: loginData.socialUser.profileImage ?? null,
      githubUrl: loginData.socialUser.githubUrl ?? null,
      refreshToken,
      tierId: lowestTier.id,
    });

    await this.attachGameSessionIfExists(loginData.gameSessionId, createdUser.id);

    const accessToken = this.authService.createAccessToken(createdUser.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async attachGameSessionIfExists(
    gameSessionId: bigint | undefined,
    userId: bigint,
  ): Promise<void> {
    if (!gameSessionId) {
      return;
    }

    await this.gameSessionService.attachUserToSession(gameSessionId, userId);
  }
}
