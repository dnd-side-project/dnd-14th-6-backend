import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description JWT 인증된 사용자 정보를 가져오는 데코레이터
 * @example
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@AuthenticatedUser() user: { userId: bigint }) {
 *   return { userId: user.userId };
 * }
 */
export const AuthenticatedUser = createParamDecorator(
  (
    _data: unknown,
    ctx: ExecutionContext,
  ): {
    userId: bigint;
  } => {
    const request = ctx.switchToHttp().getRequest<{
      user: {
        userId: bigint;
      };
    }>();
    return request.user;
  },
);
