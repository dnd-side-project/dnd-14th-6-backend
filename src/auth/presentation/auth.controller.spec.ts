import { Request, Response } from 'express';

import { AuthFacade } from '../application/auth.facade';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authFacade: jest.Mocked<AuthFacade>;

  beforeEach(() => {
    authFacade = {
      processRefreshTokens: jest.fn(),
    } as unknown as jest.Mocked<AuthFacade>;

    controller = new AuthController(authFacade);
  });

  const createMockResponse = (): Pick<Response, 'status' | 'cookie' | 'json'> => {
    const response = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    return response;
  };

  describe('refreshTokens', () => {
    it('토큰 갱신 성공 시 setAuthCookies를 호출하고 200 응답한다', async () => {
      const response = createMockResponse();
      const setAuthCookiesSpy = jest
        .spyOn(controller as unknown as { setAuthCookies: jest.Mock }, 'setAuthCookies')
        .mockImplementation(() => {});

      authFacade.processRefreshTokens.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await controller.refreshTokens({} as Request, response as Response, { userId: 10n });

      expect(setAuthCookiesSpy).toHaveBeenCalledWith(response, 'access-token', 'refresh-token');
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ statusCode: 200, success: true });
    });

    it('토큰 갱신 처리 중 에러가 발생하면 예외를 전파한다', async () => {
      const response = createMockResponse();
      const expectedError = new Error('refresh failed');
      authFacade.processRefreshTokens.mockRejectedValue(expectedError);

      await expect(
        controller.refreshTokens({} as Request, response as Response, { userId: 10n }),
      ).rejects.toThrow(expectedError);
    });
  });
});
