import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserOwnershipGuard } from './user-ownership.guard';

describe('UserOwnershipGuard', () => {
  let guard: UserOwnershipGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOwnershipGuard, Reflector],
    }).compile();

    guard = module.get<UserOwnershipGuard>(UserOwnershipGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const createMockContext = (
    user: { userId: bigint } | null,
    params: Record<string, string> = {},
    query: Record<string, string> = {},
    body: Record<string, string> = {},
  ): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params,
          query,
          body,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  describe('@CheckOwnership 데코레이터가 없는 경우', () => {
    it('검증을 스킵하고 true를 반환한다', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const context = createMockContext({ userId: 123n }, { userId: '999' });

      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('params에서 userId 확인', () => {
    beforeEach(() => {
      jest.spyOn(reflector, 'get').mockReturnValue('userId');
    });

    it('JWT userId와 params userId가 같으면 true를 반환한다', () => {
      const context = createMockContext({ userId: 123n }, { userId: '123' });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('JWT userId와 params userId가 다르면 ForbiddenException을 던진다', () => {
      const context = createMockContext({ userId: 100n }, { userId: '123' });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('본인의 정보만 조회할 수 있습니다.');
    });

    it('큰 숫자도 올바르게 비교한다', () => {
      const context = createMockContext(
        { userId: 9007199254740991n },
        { userId: '9007199254740991' },
      );

      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('query에서 userId 확인', () => {
    beforeEach(() => {
      jest.spyOn(reflector, 'get').mockReturnValue('userId');
    });

    it('params에 없으면 query에서 userId를 찾는다', () => {
      const context = createMockContext({ userId: 123n }, {}, { userId: '123' });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('query의 userId가 다르면 ForbiddenException을 던진다', () => {
      const context = createMockContext({ userId: 100n }, {}, { userId: '123' });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('body에서 userId 확인', () => {
    beforeEach(() => {
      jest.spyOn(reflector, 'get').mockReturnValue('userId');
    });

    it('params, query에 없으면 body에서 userId를 찾는다', () => {
      const context = createMockContext({ userId: 123n }, {}, {}, { userId: '123' });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('body의 userId가 다르면 ForbiddenException을 던진다', () => {
      const context = createMockContext({ userId: 100n }, {}, {}, { userId: '123' });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('userId가 요청에 없는 경우', () => {
    beforeEach(() => {
      jest.spyOn(reflector, 'get').mockReturnValue('userId');
    });

    it('검증을 스킵하고 true를 반환한다', () => {
      const context = createMockContext({ userId: 123n });

      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('user 정보가 없는 경우', () => {
    beforeEach(() => {
      jest.spyOn(reflector, 'get').mockReturnValue('userId');
    });

    it('ForbiddenException을 던진다', () => {
      const context = createMockContext(null, { userId: '123' });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('인증 정보가 유효하지 않습니다.');
    });
  });

  describe('다른 필드명 사용', () => {
    it('지정한 필드명으로 검증한다', () => {
      jest.spyOn(reflector, 'get').mockReturnValue('id');

      const context = createMockContext({ userId: 123n }, { id: '123' });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('다른 필드가 다르면 ForbiddenException을 던진다', () => {
      jest.spyOn(reflector, 'get').mockReturnValue('id');

      const context = createMockContext({ userId: 100n }, { id: '123' });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('우선순위 확인', () => {
    beforeEach(() => {
      jest.spyOn(reflector, 'get').mockReturnValue('userId');
    });

    it('params가 query보다 우선한다', () => {
      const context = createMockContext(
        { userId: 123n },
        { userId: '123' },
        { userId: '999' }, // query는 무시
      );

      expect(guard.canActivate(context)).toBe(true);
    });

    it('query가 body보다 우선한다', () => {
      const context = createMockContext(
        { userId: 123n },
        {},
        { userId: '123' },
        { userId: '999' }, // body는 무시
      );

      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
