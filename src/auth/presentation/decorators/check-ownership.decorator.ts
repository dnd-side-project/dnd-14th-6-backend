import { SetMetadata } from '@nestjs/common';

export const CHECK_OWNERSHIP_KEY = 'checkOwnership';

/**
 * @description params, query, body에서 확인할 userId 필드명을 지정합니다
 * @example
 * @Get('/:userId/stats')
 * @UseGuards(JwtAuthGuard, UserOwnershipGuard)
 * @CheckOwnership('userId')
 * getUserStats(@Param('userId') userId: string) { ... }
 */
export const CheckOwnership = (paramName: string = 'userId') =>
  SetMetadata(CHECK_OWNERSHIP_KEY, paramName);
