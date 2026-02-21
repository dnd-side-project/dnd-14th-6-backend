import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const JWT_TOKEN_SECRET = 'test-jwt-token-secret';
  const JWT_AUTH_CODE_SECRET = 'test-auth-code-secret';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: new JwtService({ secret: JWT_TOKEN_SECRET }),
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              if (key === 'JWT_AUTH_CODE_SECRET') return JWT_AUTH_CODE_SECRET;

              throw new Error(`Unknown config key: ${key}`);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('issueTokens', () => {
    it('userId로 accessToken과 refreshToken을 발급한다', () => {
      const result = service.issueTokens(1n);

      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    });
  });

  describe('createTemporalAuthorizationCode', () => {
    it('발급한 인증 코드를 반환한다', () => {
      const code = service.createTemporalAuthorizationCode(42n);

      expect(typeof code).toBe('string');
    });
  });

  describe('verifyAuthorizationCode', () => {
    it('유효한 인증 코드 검증 후 userId를 bigint로 반환한다', () => {
      const code = service.createTemporalAuthorizationCode(99n);

      const result = service.verifyAuthorizationCode(code);

      expect(result).toBe(99n);
    });

    it('type이 auth_code가 아닌 JWT는 UnauthorizedException을 던진다', () => {
      const codeWithWrongType = jwtService.sign(
        { sub: '1', type: 'access_token' },
        { expiresIn: '1m', secret: JWT_AUTH_CODE_SECRET },
      );

      expect(() => service.verifyAuthorizationCode(codeWithWrongType)).toThrow(
        new UnauthorizedException('유효하지 않은 인가 코드입니다.'),
      );
    });

    it('잘못된 시크릿으로 서명된 코드는 UnauthorizedException을 던진다', () => {
      const codeWithWrongSecret = jwtService.sign(
        { sub: '1', type: 'auth_code' },
        { expiresIn: '1m', secret: 'wrong-secret' },
      );

      expect(() => service.verifyAuthorizationCode(codeWithWrongSecret)).toThrow(
        new UnauthorizedException('유효하지 않은 인가 코드입니다.'),
      );
    });
  });

  describe('verifyRefreshTokenWithSavedToken', () => {
    it('요청 토큰과 저장 토큰이 일치하면 예외 없이 통과한다', () => {
      expect(() =>
        service.verifyRefreshTokenWithSavedToken('same-token', 'same-token'),
      ).not.toThrow();
    });

    it('요청 토큰과 저장 토큰이 다르면 UnauthorizedException을 던진다', () => {
      expect(() =>
        service.verifyRefreshTokenWithSavedToken('request-token', 'saved-token'),
      ).toThrow(new UnauthorizedException('유효하지 않은 토큰입니다.'));
    });

    it('길이가 다른 토큰이면 UnauthorizedException을 던진다', () => {
      expect(() => service.verifyRefreshTokenWithSavedToken('short', 'much-longer-token')).toThrow(
        new UnauthorizedException('유효하지 않은 토큰입니다.'),
      );
    });
  });
});
