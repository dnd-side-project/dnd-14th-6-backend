import { timingSafeEqual } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly authCodeSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.authCodeSecret = this.configService.getOrThrow<string>('JWT_AUTH_CODE_SECRET');
  }

  /**
   * @description access, refresh token 발급
   */
  issueTokens(userId: bigint): { accessToken: string; refreshToken: string } {
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
   * @description temporal authorization code token 생성
   */
  createTemporalAuthorizationCode(userId: bigint): string {
    return this.jwtService.sign(
      {
        sub: userId.toString(),
        type: 'auth_code',
      },
      { expiresIn: '1m', secret: this.authCodeSecret },
    );
  }

  /**
   * @description 임시 인가 코드 jwt 검증 후 userId 반환
   */
  verifyAuthorizationCode(code: string): bigint {
    let payload: { sub: string; type: string };

    try {
      payload = this.jwtService.verify<{ sub: string; type: string }>(code, {
        secret: this.authCodeSecret,
      });
    } catch {
      throw new UnauthorizedException('유효하지 않은 인가 코드입니다.');
    }

    if (payload.type !== 'auth_code') {
      throw new UnauthorizedException('유효하지 않은 인가 코드입니다.');
    }

    return BigInt(payload.sub);
  }

  /**
   * @description 저장된 리프레시 토큰과 요청한 리프레시 토큰이 같은지 검증
   */
  verifyRefreshTokenWithSavedToken(requestedToken: string, savedToken: string): void {
    const requestedTokenBuf = Buffer.from(requestedToken);
    const savedTokenBuf = Buffer.from(savedToken);

    if (
      requestedTokenBuf.length !== savedTokenBuf.length ||
      !timingSafeEqual(requestedTokenBuf, savedTokenBuf)
    ) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
