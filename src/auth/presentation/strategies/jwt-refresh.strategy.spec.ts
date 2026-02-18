import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';

import { AuthFacade } from '@/auth/application/auth.facade';

import { JwtRefreshStrategy } from './jwt-refresh.strategy';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;
  let configService: jest.Mocked<ConfigService>;
  let authFacade: jest.Mocked<AuthFacade>;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('jwt-secret-key'),
    } as unknown as jest.Mocked<ConfigService>;

    authFacade = {
      verifyRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<AuthFacade>;

    strategy = new JwtRefreshStrategy(configService, authFacade);
  });

  it('유효한 payload와 저장 토큰으로 검증을 수행해 사용자 ID를 반환한다', async () => {
    const request = {
      body: {
        refreshToken: 'refresh-token',
      },
    } as Request;

    const result = await strategy.validate(request, { sub: '12' });

    expect(authFacade.verifyRefreshToken).toHaveBeenCalledWith(12n, 'refresh-token');
    expect(result).toEqual({ userId: 12n });
  });

  it('payload에 sub가 없으면 인증 실패 예외를 던진다', async () => {
    const request = {
      body: {
        refreshToken: 'refresh-token',
      },
    } as Request;

    await expect(strategy.validate(request, {} as { sub: string })).rejects.toThrow(
      new UnauthorizedException('유효하지 않은 토큰입니다.'),
    );
  });

  it('저장 토큰 검증이 실패하면 예외를 전달한다', async () => {
    const request = {
      body: {
        refreshToken: 'invalid-token',
      },
    } as Request;
    const expectedError = new UnauthorizedException('유효하지 않은 토큰입니다.');

    authFacade.verifyRefreshToken.mockRejectedValueOnce(expectedError);

    await expect(strategy.validate(request, { sub: '99' })).rejects.toThrow(expectedError);
  });
});
