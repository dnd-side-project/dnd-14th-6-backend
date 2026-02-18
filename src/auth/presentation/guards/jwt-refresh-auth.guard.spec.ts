/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UnauthorizedException } from '@nestjs/common';

import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';

describe('JwtRefreshAuthGuard', () => {
  let guard: JwtRefreshAuthGuard;

  beforeEach(() => {
    guard = new JwtRefreshAuthGuard();
  });

  it('토큰이 만료되면 인증 실패 예외를 반환한다', () => {
    expect(() =>
      guard.handleRequest(undefined, undefined, {
        name: 'TokenExpiredError',
      }),
    ).toThrow(new UnauthorizedException('토큰이 만료되었습니다.'));
  });

  it('토큰이 조작된 경우 인증 실패 예외를 반환한다', () => {
    expect(() =>
      guard.handleRequest(undefined, undefined, {
        name: 'JsonWebTokenError',
      }),
    ).toThrow(new UnauthorizedException('유효하지 않은 토큰입니다.'));
  });

  it('Nest 에러가 있으면 에러를 그대로 전달한다', () => {
    const sourceError = new Error('auth failed');

    expect(() => guard.handleRequest(sourceError, undefined, undefined)).toThrow('auth failed');
  });

  it('인증된 사용자 정보가 없으면 인증 필요 예외를 반환한다', () => {
    expect(() => guard.handleRequest(undefined, undefined, undefined)).toThrow(
      new UnauthorizedException('인증이 필요합니다.'),
    );
  });

  it('정상적인 인증 정보면 사용자 객체를 그대로 반환한다', () => {
    const user = { userId: 10n };

    const result = guard.handleRequest(undefined, user, undefined);

    expect(result).toEqual(user);
  });
});
