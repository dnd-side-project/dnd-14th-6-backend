/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }

    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    if (err) {
      throw err as Error;
    }

    if (!user) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    return user;
  }
}
