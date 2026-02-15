/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { AuthFacade } from '../../application/auth.facade';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authFacade: jest.Mocked<AuthFacade>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: AuthFacade,
          useValue: {
            isExistUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authFacade = module.get(AuthFacade);
  });

  describe('validate', () => {
    it('유효한 payload와 존재하는 사용자면 userId를 반환한다', async () => {
      const payload = { sub: '123' };

      authFacade.isExistUser.mockResolvedValue(true);

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 123n,
      });
      expect(authFacade.isExistUser).toHaveBeenCalledWith(123n);
    });

    it('payload에 sub가 없으면 UnauthorizedException을 던진다', async () => {
      const payload = {} as any;

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(payload)).rejects.toThrow('유효하지 않은 토큰입니다.');
      expect(authFacade.isExistUser).not.toHaveBeenCalled();
    });

    it('존재하지 않는 사용자면 NotFoundException을 던진다', async () => {
      const payload = { sub: '999' };

      authFacade.isExistUser.mockResolvedValue(false);

      await expect(strategy.validate(payload)).rejects.toThrow(NotFoundException);
      await expect(strategy.validate(payload)).rejects.toThrow('존재하지 않는 사용자입니다.');
      expect(authFacade.isExistUser).toHaveBeenCalledWith(999n);
    });

    it('큰 숫자도 bigint로 올바르게 변환하고 조회한다', async () => {
      const payload = { sub: '9007199254740991' };

      authFacade.isExistUser.mockResolvedValue(true);

      const result = await strategy.validate(payload);

      expect(result.userId).toBe(9007199254740991n);
      expect(authFacade.isExistUser).toHaveBeenCalledWith(9007199254740991n);
    });
  });
});
