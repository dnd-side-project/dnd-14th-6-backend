import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { GameSessionService } from '@games/application/game-session.service';
import { TiersService } from '@tiers/application/tiers.service';
import { Tier } from '@tiers/domain/tiers.entity';
import { UsersService } from '@users/application/users.service';
import { DEFAULT_PROFILE_IMAGE } from '@users/domain/user.business-rule';
import { User } from '@users/domain/users.entity';

import { AuthFacade } from './auth.facade';
import { AuthService } from './auth.service';

function createMockUser(overrides: Partial<User> = {}): User {
  return User.from({
    id: 1n,
    email: 'test@test.com',
    nickname: 'testUser',
    provider: 'github',
    providerId: '12345',
    totalScore: 0n,
    refreshToken: 'token',
    createdAt: new Date(),
    updatedAt: new Date(),
    githubUrl: null,
    profileImage: DEFAULT_PROFILE_IMAGE,
    tierId: null,
    tier: null,
    ...overrides,
  });
}

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authService: jest.Mocked<AuthService>;
  let usersService: jest.Mocked<UsersService> & { findById: jest.Mock };
  let gameSessionService: jest.Mocked<GameSessionService>;
  let tiersService: jest.Mocked<TiersService>;

  const lowestTier: Tier = Tier.from({
    id: 1,
    name: 'Bronze',
    minScore: 0,
    imageUrl: null,
    iconUrl: null,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFacade,
        {
          provide: AuthService,
          useValue: {
            issueTokens: jest.fn(),
            verifyRefreshTokenWithSavedToken: jest.fn(),
            createTemporalAuthorizationCode: jest.fn(),
            verifyAuthorizationCode: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            createSocialUser: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: GameSessionService,
          useValue: {
            attachUserToSession: jest.fn(),
          },
        },
        {
          provide: TiersService,
          useValue: {
            getLowestTier: jest.fn(),
          },
        },
      ],
    }).compile();

    facade = module.get<AuthFacade>(AuthFacade);
    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    gameSessionService = module.get(GameSessionService);
    tiersService = module.get(TiersService);

    tiersService.getLowestTier.mockResolvedValue(lowestTier);
  });

  describe('processSocialLogin', () => {
    it('기존 유저는 새로 생성하지 않고 userId를 반환한다', async () => {
      const existingUser = createMockUser({ id: 10n, email: 'hello@test.com' });
      usersService.findByEmail.mockResolvedValue(existingUser);

      const result = await facade.processSocialLogin({
        provider: 'github',
        socialUser: {
          id: 'provider-1',
          email: existingUser.email,
          nickname: 'nickname',
        },
      });

      expect(result).toEqual({ userId: 10n });
      expect(usersService.createSocialUser).not.toHaveBeenCalled();
    });

    it('신규 유저 + gameSessionId이면 유저 생성 후 세션을 연결하고 userId를 반환한다', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const createdUser = createMockUser({
        id: 99n,
        email: 'new@test.com',
        nickname: 'newbie',
        refreshToken: '',
      });
      usersService.createSocialUser.mockResolvedValue(createdUser);
      const result = await facade.processSocialLogin({
        provider: 'github',
        socialUser: {
          id: 'github-user-id',
          email: 'new@test.com',
          nickname: 'newbie',
          profileImage: 'https://example.com/profile.png',
          githubUrl: 'https://github.com/newbie',
        },
        gameSessionId: 777n,
      });

      expect(usersService.createSocialUser).toHaveBeenCalledWith({
        email: 'new@test.com',
        nickname: 'newbie',
        provider: 'github',
        providerId: 'github-user-id',
        profileImage: 'https://example.com/profile.png',
        githubUrl: 'https://github.com/newbie',
        refreshToken: '',
        tierId: 1,
      });
      expect(gameSessionService.attachUserToSession).toHaveBeenCalledWith(777n, 99n);
      expect(authService.issueTokens).not.toHaveBeenCalled();
      expect(result).toEqual({ userId: 99n });
    });

    it('신규 유저 + gameSessionId 없음이면 세션 연결을 생략한다', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      authService.issueTokens.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const createdUser = createMockUser({
        id: 55n,
        email: 'new2@test.com',
        nickname: 'new2',
        refreshToken: '',
      });
      usersService.createSocialUser.mockResolvedValue(createdUser);

      await facade.processSocialLogin({
        provider: 'google',
        socialUser: {
          id: 'google-user-id',
          email: 'new2@test.com',
          nickname: 'new2',
        },
      });

      expect(gameSessionService.attachUserToSession).not.toHaveBeenCalled();
    });
  });

  describe('processRefreshTokens', () => {
    it('토큰 발급 결과를 그대로 반환하고 갱신 토큰을 저장 요청한다', async () => {
      const userId = 10n;
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      authService.issueTokens.mockReturnValue(tokens);
      usersService.updateRefreshToken.mockResolvedValue(createMockUser({ id: userId }));

      const result = await facade.processRefreshTokens(userId);

      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(userId, tokens.refreshToken);
      expect(result).toEqual(tokens);
    });

    it('토큰 발급 중 예외가 발생하면 저장은 수행하지 않는다', async () => {
      const userId = 10n;
      const error = new Error('issue fail');
      authService.issueTokens.mockImplementation(() => {
        throw error;
      });

      await expect(facade.processRefreshTokens(userId)).rejects.toThrow(error);

      expect(usersService.updateRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('generateTemporalAuthorizationCode', () => {
    it('인증 코드 발급 서비스 함수에 userId를 전달하고 발급한 토큰을 반환한다', () => {
      const userId = 42n;
      authService.createTemporalAuthorizationCode.mockReturnValue('auth.code.jwt');

      const result = facade.generateTemporalAuthorizationCode(userId);

      expect(authService.createTemporalAuthorizationCode).toHaveBeenCalledWith(userId);
      expect(result).toBe('auth.code.jwt');
    });
  });

  describe('exchangeAuthorizationCode', () => {
    it('유효한 코드를 검증한 후 토큰을 발급하고 갱신 토큰을 저장한다', async () => {
      const userId = 10n;
      const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

      authService.verifyAuthorizationCode.mockReturnValue(userId);
      authService.issueTokens.mockReturnValue(tokens);
      usersService.updateRefreshToken.mockResolvedValue(createMockUser({ id: userId }));

      const result = await facade.exchangeAuthorizationCode('valid.code');

      expect(authService.verifyAuthorizationCode).toHaveBeenCalledWith('valid.code');
      expect(authService.issueTokens).toHaveBeenCalledWith(userId);
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(userId, tokens.refreshToken);
      expect(result).toEqual(tokens);
    });

    it('코드 검증이 실패하면 예외를 전파하고 토큰 발급은 하지 않는다', async () => {
      const error = new UnauthorizedException('유효하지 않은 인가 코드입니다.');
      authService.verifyAuthorizationCode.mockImplementation(() => {
        throw error;
      });

      await expect(facade.exchangeAuthorizationCode('invalid.code')).rejects.toThrow(error);

      expect(authService.issueTokens).not.toHaveBeenCalled();
    });
  });

  describe('verifyRefreshToken', () => {
    beforeEach(() => {
      usersService.findById.mockResolvedValue(
        createMockUser({
          id: 1n,
          refreshToken: 'saved-refresh-token',
        }),
      );
    });

    it('요청 토큰과 저장 토큰이 일치하면 통과한다', async () => {
      const userId = 1n;
      const requestToken = 'request-refresh-token';

      await facade.verifyRefreshToken(userId, requestToken);

      expect(authService.verifyRefreshTokenWithSavedToken).toHaveBeenCalledWith(
        requestToken,
        'saved-refresh-token',
      );
    });

    it('요청 토큰이 저장 토큰과 다르면 UnauthorizedException이 전달된다', async () => {
      const userId = 1n;
      const expectedError = new UnauthorizedException('유효하지 않은 토큰입니다.');

      authService.verifyRefreshTokenWithSavedToken = jest.fn().mockImplementation(() => {
        throw expectedError;
      });

      await expect(facade.verifyRefreshToken(userId, 'bad-token')).rejects.toThrow(expectedError);
    });
  });
});
