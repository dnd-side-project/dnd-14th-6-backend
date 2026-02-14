import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthFacade } from '../application/auth.facade';

import { SocialLoginProvider } from '../domain/auth.business-rule';

import { ApiGithubLoginCallback } from './decorators/github-login-callback-swagger.decorator';
import { ApiGoogleLoginCallback } from './decorators/google-login-callback-swagger.decorator';
import { ApiLoginByGithub } from './decorators/login-by-github-swagger.decorator';
import { ApiLoginByGoogle } from './decorators/login-by-google-swagger.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { decodeOAuthState } from './utils/oauth-state.util';
import { OAuthCallbackRequest } from './types/auth.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authFacade: AuthFacade) {}

  @Get('login/google')
  @ApiLoginByGoogle()
  @UseGuards(GoogleAuthGuard)
  async loginByGoogle() {}

  @Get('login/github')
  @ApiLoginByGithub()
  @UseGuards(GithubAuthGuard)
  async loginByGithub() {}

  @Get('login/google/callback')
  @ApiGoogleLoginCallback()
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: OAuthCallbackRequest, @Res() res: Response): Promise<void> {
    await this.handleOAuthCallback(req, res, 'google');
  }

  @Get('login/github/callback')
  @ApiGithubLoginCallback()
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req: OAuthCallbackRequest, @Res() res: Response): Promise<void> {
    await this.handleOAuthCallback(req, res, 'github');
  }

  private async handleOAuthCallback(
    req: OAuthCallbackRequest,
    res: Response,
    provider: SocialLoginProvider,
  ): Promise<void> {
    try {
      const { redirectUrl, gameSessionId } = this.parseOAuthCallbackState(req.query.state);

      const { accessToken, refreshToken } = await this.authFacade.processSocialLogin({
        provider,
        socialUser: req.user,
        gameSessionId,
      });

      this.setAuthCookies(res, accessToken, refreshToken);

      res.redirect(redirectUrl);
    } catch {
      this.logger.warn(`[${provider}] 로그인 처리 실패, 기본 경로로 리다이렉트`);
      res.redirect('/');
    }
  }

  private parseOAuthCallbackState(stateEncoded?: string): {
    redirectUrl: string;
    gameSessionId: bigint | undefined;
  } {
    const stateObj = decodeOAuthState(stateEncoded);

    if (!stateObj) {
      return { redirectUrl: '/', gameSessionId: undefined };
    }

    let gameSessionId: bigint | undefined;
    if (stateObj.gameSessionId) {
      try {
        gameSessionId = BigInt(stateObj.gameSessionId);
      } catch {
        gameSessionId = undefined;
      }
    }

    return {
      redirectUrl: stateObj.redirectUrl ?? '/',
      gameSessionId,
    };
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProd = process.env.NODE_ENV === 'production';

    this.setRefreshTokenCookie(res, refreshToken, isProd);
    this.setAccessTokenCookie(res, accessToken, isProd);
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string, isProd: boolean): void {
    if (!refreshToken) {
      return;
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
  }

  private setAccessTokenCookie(res: Response, accessToken: string, isProd: boolean): void {
    if (!accessToken) {
      return;
    }

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 1 * 60 * 60 * 1000,
    });
  }
}
