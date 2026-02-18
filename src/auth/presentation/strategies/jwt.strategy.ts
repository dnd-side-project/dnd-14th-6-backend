import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthFacade } from '../../application/auth.facade';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authFacade: AuthFacade,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_TOKEN_SECRET'),
    });
  }

  async validate(payload: { sub: string }) {
    if (!payload.sub) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const userId = BigInt(payload.sub);

    const isExistUser = await this.authFacade.isExistUser(userId);

    if (!isExistUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    return {
      userId,
    };
  }
}
