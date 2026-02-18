import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { AuthFacade } from '@auth/application/auth.facade';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

function getRefreshToken(request: Request): string | null {
  const body = request.body as { refreshToken?: string };

  if (typeof body !== 'object' || body === null) {
    return null;
  }

  const { refreshToken } = body;

  if (typeof refreshToken !== 'string') {
    return null;
  }

  return refreshToken;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authFacade: AuthFacade,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return getRefreshToken(request);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { sub: string }) {
    if (!payload.sub) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const userId = BigInt(payload.sub);
    const { refreshToken } = request.body as { refreshToken: string };

    await this.authFacade.verifyRefreshToken(userId, refreshToken);

    return {
      userId,
    };
  }
}
