import { Injectable } from '@nestjs/common';

import { GameSessionService } from '@games/application/game-session.service';
import { TiersService } from '@tiers/application/tiers.service';
import { UsersService } from '@users/application/users.service';

import { AuthService } from './auth.service';
import {
  ProcessSocialLoginFacadeRequestDto,
  ProcessSocialLoginFacadeResponseDto,
} from './service-dto/process-social-login.service-dto';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly gameSessionService: GameSessionService,
    private readonly tiersService: TiersService,
  ) {}

  /**
   * @description 토큰 발급 인증용 임시 코드 발급
   */
  generateTemporalAuthorizationCode(userId: bigint): string {
    return this.authService.createTemporalAuthorizationCode(userId);
  }

  /**
   * @description 인증용 임시 코드 검증 후 access, refresh token 발급
   */
  async exchangeAuthorizationCode(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userId = this.authService.verifyAuthorizationCode(code);

    return this.loginExistingUser(userId);
  }

  /**
   * @description 유효한 refreshToken인지 검증
   */
  async verifyRefreshToken(userId: bigint, refreshToken: string): Promise<void> {
    const user = await this.usersService.findById(userId);

    this.authService.verifyRefreshTokenWithSavedToken(refreshToken, user.refreshToken);
  }

  /**
   * @description 기존 유저 로그인 플로우를 통한 토큰 갱신
   */
  async processRefreshTokens(
    userId: bigint,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.loginExistingUser(userId);
  }

  /**
   * @description 소셜 로그인 처리 서비스 함수
   */
  async processSocialLogin(
    loginData: ProcessSocialLoginFacadeRequestDto,
  ): Promise<ProcessSocialLoginFacadeResponseDto> {
    const existingUser = await this.usersService.findByEmail(loginData.socialUser.email);

    if (existingUser) {
      return { userId: existingUser.id };
    }

    return this.registerNewSocialUser(loginData);
  }

  /**
   * @description 존재하는 유저인지 조회
   */
  async isExistUser(userId: bigint): Promise<boolean> {
    return this.usersService.isExistUser(userId);
  }

  /**
   * @description 기존 유저 로그인 처리 (신규 토큰 발급 및 업데이트)
   */
  private async loginExistingUser(
    userId: bigint,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = this.authService.issueTokens(userId);

    await this.usersService.updateRefreshToken(userId, tokens.refreshToken);

    return {
      ...tokens,
    };
  }

  /**
   * @description 새로운 소셜로그인 유저 생성
   */
  private async registerNewSocialUser(
    loginData: ProcessSocialLoginFacadeRequestDto,
  ): Promise<ProcessSocialLoginFacadeResponseDto> {
    const lowestTier = await this.tiersService.getLowestTier();

    const createdUser = await this.usersService.createSocialUser({
      email: loginData.socialUser.email,
      nickname: loginData.socialUser.nickname,
      provider: loginData.provider,
      providerId: loginData.socialUser.id,
      profileImage: loginData.socialUser.profileImage ?? null,
      githubUrl: loginData.socialUser.githubUrl ?? null,
      refreshToken: '',
      tierId: lowestTier.id,
    });

    await this.attachGameSessionIfExists(loginData.gameSessionId, createdUser.id);

    return { userId: createdUser.id };
  }

  /**
   * @description gameSessionId가 존재하면 유저ID와 연동
   */
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
