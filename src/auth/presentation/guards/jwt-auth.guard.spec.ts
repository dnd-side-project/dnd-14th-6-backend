/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  describe('handleRequest', () => {
    it('토큰이 만료되면 커스텀 에러 메시지를 던진다', () => {
      const info = { name: 'TokenExpiredError' };

      expect(() => guard.handleRequest(null, null, info)).toThrow(UnauthorizedException);
      expect(() => guard.handleRequest(null, null, info)).toThrow('토큰이 만료되었습니다.');
    });

    it('유효하지 않은 토큰이면 커스텀 에러 메시지를 던진다', () => {
      const info = { name: 'JsonWebTokenError' };

      expect(() => guard.handleRequest(null, null, info)).toThrow(UnauthorizedException);
      expect(() => guard.handleRequest(null, null, info)).toThrow('유효하지 않은 토큰입니다.');
    });

    it('사용자가 없으면 인증 에러를 던진다', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(UnauthorizedException);
      expect(() => guard.handleRequest(null, null, null)).toThrow('인증이 필요합니다.');
    });

    it('에러가 있으면 그대로 던진다', () => {
      const error = new NotFoundException('사용자 없음');

      expect(() => guard.handleRequest(error, null, null)).toThrow(error);
    });

    it('유효한 사용자면 user를 반환한다', () => {
      const user = { userId: 123n };

      const result = guard.handleRequest(null, user, null);

      expect(result).toEqual(user);
    });
  });
});
