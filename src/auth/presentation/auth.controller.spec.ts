import { Response } from 'express';

import { AuthFacade } from '../application/auth.facade';
import { AuthController } from './auth.controller';
import { GetTokensQueryDto, GetTokensResponseDto } from './dto/get-tokens.dto';
import { RefreshTokensResponseDto } from './dto/refresh-tokens.dto';
import { OAuthCallbackRequest } from './types/auth.type';
import { encodeOAuthState } from './utils/oauth-state.util';

describe('AuthController', () => {
  let controller: AuthController;
  let authFacade: jest.Mocked<AuthFacade>;

  beforeEach(() => {
    authFacade = {
      processRefreshTokens: jest.fn(),
      processSocialLogin: jest.fn(),
      generateTemporalAuthorizationCode: jest.fn(),
      exchangeAuthorizationCode: jest.fn(),
    } as unknown as jest.Mocked<AuthFacade>;

    controller = new AuthController(authFacade);
  });

  const createMockResponse = (): Pick<Response, 'redirect'> => ({
    redirect: jest.fn(),
  });

  const createOAuthCallbackRequest = (overrides: Partial<OAuthCallbackRequest> = {}) =>
    ({
      query: {},
      user: {
        id: 'provider-id',
        email: 'user@example.com',
        nickname: 'testUser',
      },
      ...overrides,
    }) as unknown as OAuthCallbackRequest;

  describe('refreshTokens', () => {
    it('토큰 갱신 성공 시 새 토큰을 응답 DTO로 반환한다', async () => {
      const tokens = { accessToken: 'new-access', refreshToken: 'new-refresh' };
      authFacade.processRefreshTokens.mockResolvedValue(tokens);

      const result = await controller.refreshTokens({ userId: 10n });

      expect(authFacade.processRefreshTokens).toHaveBeenCalledWith(10n);
      expect(result).toEqual(RefreshTokensResponseDto.from(tokens));
    });

    it('토큰 갱신 처리 중 에러가 발생하면 예외를 전파한다', async () => {
      const expectedError = new Error('refresh failed');
      authFacade.processRefreshTokens.mockRejectedValue(expectedError);

      await expect(controller.refreshTokens({ userId: 10n })).rejects.toThrow(expectedError);
    });
  });

  describe('getTokens', () => {
    it('유효한 인증 코드로 accessToken과 refreshToken을 반환한다', async () => {
      const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };
      authFacade.exchangeAuthorizationCode.mockResolvedValue(tokens);

      const query: GetTokensQueryDto = { code: 'valid.auth.code' };
      const result = await controller.getTokens(query);

      expect(authFacade.exchangeAuthorizationCode).toHaveBeenCalledWith('valid.auth.code');
      expect(result).toEqual(GetTokensResponseDto.from(tokens));
    });

    it('인증 코드 교환 실패 시 예외를 전파한다', async () => {
      const error = new Error('invalid code');
      authFacade.exchangeAuthorizationCode.mockRejectedValue(error);

      await expect(controller.getTokens({ code: 'bad.code' })).rejects.toThrow(error);
    });
  });

  describe('googleAuthCallback', () => {
    it('OAuth 로그인 성공 시 redirectUrl에 code 쿼리 파라미터를 포함하여 리다이렉트한다', async () => {
      const res = createMockResponse();
      const redirectUrl = 'http://localhost:3000/callback';

      authFacade.processSocialLogin.mockResolvedValue({ userId: 42n });
      authFacade.generateTemporalAuthorizationCode.mockReturnValue('auth.code.jwt');

      const req = createOAuthCallbackRequest({
        query: { state: encodeOAuthState({ redirectUrl }) },
      });

      await controller.googleAuthCallback(req, res as Response);

      expect(authFacade.generateTemporalAuthorizationCode).toHaveBeenCalledWith(42n);
      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/callback?code=auth.code.jwt',
      );
    });

    it('state에 gameSessionId가 포함되어 있으면 processSocialLogin에 bigint로 전달한다', async () => {
      const res = createMockResponse();
      authFacade.processSocialLogin.mockResolvedValue({ userId: 10n });
      authFacade.generateTemporalAuthorizationCode.mockReturnValue('code');

      const req = createOAuthCallbackRequest({
        query: {
          state: encodeOAuthState({
            redirectUrl: 'http://localhost:3000',
            gameSessionId: '999',
          }),
        },
      });

      await controller.googleAuthCallback(req, res as Response);

      expect(authFacade.processSocialLogin).toHaveBeenCalledWith(
        expect.objectContaining({ gameSessionId: 999n }),
      );
    });

    it('state가 없으면 기본 경로(/)에 code 쿼리 파라미터를 포함하여 리다이렉트한다', async () => {
      const res = createMockResponse();
      authFacade.processSocialLogin.mockResolvedValue({ userId: 5n });
      authFacade.generateTemporalAuthorizationCode.mockReturnValue('code');

      const req = createOAuthCallbackRequest({ query: {} });

      await controller.googleAuthCallback(req, res as Response);

      expect(res.redirect).toHaveBeenCalledWith('/?code=code');
    });

    it('로그인 처리 중 에러가 발생하면 기본 경로(/)로 리다이렉트한다', async () => {
      const res = createMockResponse();
      authFacade.processSocialLogin.mockRejectedValue(new Error('login failed'));

      const req = createOAuthCallbackRequest();

      await controller.googleAuthCallback(req, res as Response);

      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('githubAuthCallback', () => {
    it('OAuth 로그인 성공 시 redirectUrl에 code 쿼리 파라미터를 포함하여 리다이렉트한다', async () => {
      const res = createMockResponse();
      const redirectUrl = 'http://localhost:3000/callback';

      authFacade.processSocialLogin.mockResolvedValue({ userId: 77n });
      authFacade.generateTemporalAuthorizationCode.mockReturnValue('github.code.jwt');

      const req = createOAuthCallbackRequest({
        query: { state: encodeOAuthState({ redirectUrl }) },
      });

      await controller.githubAuthCallback(req, res as Response);

      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/callback?code=github.code.jwt',
      );
    });

    it('로그인 처리 중 에러가 발생하면 기본 경로(/)로 리다이렉트한다', async () => {
      const res = createMockResponse();
      authFacade.processSocialLogin.mockRejectedValue(new Error('github login failed'));

      await controller.githubAuthCallback(createOAuthCallbackRequest(), res as Response);

      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });
});
