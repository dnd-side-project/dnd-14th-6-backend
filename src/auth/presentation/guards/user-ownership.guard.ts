import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CHECK_OWNERSHIP_KEY } from '../decorators/check-ownership.decorator';

/**
 * @description JWT로 인증된 사용자가 요청한 리소스의 소유자인지 확인하는 Guard
 * @requires JwtAuthGuard가 먼저 실행되어야 합니다
 * @example
 * @Get('/:userId/stats')
 * @UseGuards(JwtAuthGuard, UserOwnershipGuard)
 * @CheckOwnership('userId')
 * getUserStats(@Param('userId') userId: string) { ... }
 */
@Injectable()
export class UserOwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const paramName = this.reflector.get<string>(CHECK_OWNERSHIP_KEY, context.getHandler());
    if (!paramName) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user: {
        userId: bigint;
      };
      params: Record<string, string>;
      query: Record<string, string>;
      body: Record<string, string>;
    }>();

    const user = request.user;
    if (!user || !user.userId) {
      throw new ForbiddenException('인증 정보가 유효하지 않습니다.');
    }

    const targetUserId =
      request.params?.[paramName] || request.query?.[paramName] || request.body?.[paramName];

    if (!targetUserId) {
      return true;
    }

    const targetUserIdBigInt = BigInt(targetUserId);
    if (user.userId !== targetUserIdBigInt) {
      throw new ForbiddenException('본인의 정보만 조회할 수 있습니다.');
    }

    return true;
  }
}
