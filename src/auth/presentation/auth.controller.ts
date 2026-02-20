import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { AuthFacade } from '../application/auth.facade';
import { SocialLoginProvider } from '../domain/auth.business-rule';
import { AuthenticatedUser } from './decorators/authenticated-user.decorator';
import { ApiGetTokens } from './decorators/get-tokens-swagger.decorator';
import { ApiGithubLoginCallback } from './decorators/github-login-callback-swagger.decorator';
import { ApiGoogleLoginCallback } from './decorators/google-login-callback-swagger.decorator';
import { ApiLoginByGithub } from './decorators/login-by-github-swagger.decorator';
import { ApiLoginByGoogle } from './decorators/login-by-google-swagger.decorator';
import { ApiRefreshTokens } from './decorators/refresh-tokens-swagger.decorator';
import { GetTokensQueryDto, GetTokensResponseDto } from './dto/get-tokens.dto';
import { RefreshTokensResponseDto } from './dto/refresh-tokens.dto';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { OAuthCallbackRequest } from './types/auth.type';
import { decodeOAuthState } from './utils/oauth-state.util';

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

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  @ApiRefreshTokens()
  async refreshTokens(
    @AuthenticatedUser() user: { userId: bigint },
  ): Promise<RefreshTokensResponseDto> {
    const tokens = await this.authFacade.processRefreshTokens(user.userId);

    return RefreshTokensResponseDto.from(tokens);
  }

  @Get('token')
  @ApiGetTokens()
  async getTokens(@Query() query: GetTokensQueryDto): Promise<GetTokensResponseDto> {
    const tokens = await this.authFacade.exchangeAuthorizationCode(query.code);

    return GetTokensResponseDto.from(tokens);
  }

  /**
   * @description oauth callback 처리 핸들러
   * - 실제 유저 로그인, 회원 가입 진행
   * - 토큰 발급을 위한 임시 인증 코드 생성 후 redirect 처리
   */
  private async handleOAuthCallback(
    req: OAuthCallbackRequest,
    res: Response,
    provider: SocialLoginProvider,
  ): Promise<void> {
    try {
      const { redirectUrl, gameSessionId } = this.parseOAuthCallbackState(req.query.state);

      const { userId } = await this.authFacade.processSocialLogin({
        provider,
        socialUser: req.user,
        gameSessionId,
      });

      const code = this.authFacade.generateTemporalAuthorizationCode(userId);
      const redirectUrlWithCode = this.buildRedirectUrlWithCode(redirectUrl, code);

      res.redirect(redirectUrlWithCode);
    } catch {
      this.logger.warn(`[${provider}] 로그인 처리 실패, 기본 경로로 리다이렉트`);
      res.redirect('/');
    }
  }

  /**
   * @description OAuth callback state 객체 decode
   */
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

  /**
   * @description 로그인 redirectUrl에 code 쿼리 스트링 연결
   */
  private buildRedirectUrlWithCode(redirectUrl: string, code: string): string {
    try {
      const url = new URL(redirectUrl);
      url.searchParams.set('code', code);

      return url.toString();
    } catch {
      const separator = redirectUrl.includes('?') ? '&' : '?';

      return `${redirectUrl}${separator}code=${code}`;
    }
  }
}
