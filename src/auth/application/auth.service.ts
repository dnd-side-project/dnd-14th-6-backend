import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ProcessSocialLoginFacadeResponseDto } from './service-dto/process-social-login.service-dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * @description access, refresh token 발급
   */
  issueTokens(userId: bigint): ProcessSocialLoginFacadeResponseDto {
    return {
      accessToken: this.createAccessToken(userId),
      refreshToken: this.createRefreshToken(userId),
    };
  }

  /**
   * @description accessToken 생성
   */
  createAccessToken(userId: bigint): string {
    return this.jwtService.sign(
      {
        sub: userId.toString(),
      },
      {
        expiresIn: '1h',
      },
    );
  }

  /**
   * @description refreshToken 생성
   */
  createRefreshToken(userId: bigint): string {
    return this.jwtService.sign(
      {
        sub: userId.toString(),
      },
      {
        expiresIn: '14d',
      },
    );
  }

  /**
   * @description 저장된 리프레시 토큰과 요청한 리프레시 토큰이 같은지 검증
   */
  verifyRefreshTokenWithSavedToken(requestedToken: string, savedToken: string): void {
    if (requestedToken !== savedToken) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
