/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @description JWT 인증이 선택적인 Guard
 * - JWT 토큰이 있으면: 검증하고 request.user 설정
 * - JWT 토큰이 없으면: 그냥 통과 (request.user는 undefined)
 *
 * @example
 * @Get('sessions')
 * @UseGuards(OptionalJwtAuthGuard)
 * async getGameHistories(@AuthenticatedUser() user?: { userId: bigint }) {}
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any, _info: any, _context: ExecutionContext): TUser {
    if (err) {
      throw err;
    }

    return user;
  }
}
