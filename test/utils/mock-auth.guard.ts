import { ExecutionContext } from '@nestjs/common';

type RequestWithUser = {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, string>;
  user?: {
    userId: bigint;
  };
};

type MockAuthGuardOptions = {
  userId?: bigint | number | string;
};

export const createMockAuthGuard = (options: MockAuthGuardOptions = {}) => ({
  canActivate: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const targetUserId =
      options.userId ??
      request.params?.userId ??
      request.query?.userId ??
      request.body?.userId ??
      1;

    request.user = {
      userId: typeof targetUserId === 'bigint' ? targetUserId : BigInt(targetUserId),
    };

    return true;
  },
});

export const mockAuthGuard = createMockAuthGuard();
