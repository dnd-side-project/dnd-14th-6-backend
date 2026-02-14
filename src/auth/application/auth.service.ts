import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

import { ProcessSocialLoginResponseDto } from './service-dto/process-social-login.service-dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  issueTokens(userId: bigint): ProcessSocialLoginResponseDto {
    return {
      accessToken: this.createAccessToken(userId),
      refreshToken: this.createRefreshToken(),
    };
  }

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

  createRefreshToken(): string {
    return randomBytes(48).toString('base64url');
  }
}
