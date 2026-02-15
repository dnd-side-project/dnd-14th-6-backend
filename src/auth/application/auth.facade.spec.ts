import { Test, TestingModule } from '@nestjs/testing';

import { GameSessionService } from '@games/application/game-session.service';
import { TiersService } from '@tiers/application/tiers.service';
import { User } from '@users/domain/users.entity';
import { UsersService } from '@users/application/users.service';
import { Tier } from '@tiers/domain/tiers.entity';

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
    profileImage: null,
    tierId: null,
    tier: null,
    ...overrides,
  });
}

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authService: jest.Mocked<AuthService>;
  let usersService: jest.Mocked<UsersService>;
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
            createRefreshToken: jest.fn(),
            createAccessToken: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
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

  it('기존 유저면 refreshToken을 갱신하고 토큰을 반환한다', async () => {
    const existingUser = createMockUser({ id: 10n, email: 'hello@test.com' });
    usersService.findByEmail.mockResolvedValue(existingUser);
    authService.issueTokens.mockReturnValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    usersService.updateRefreshToken.mockResolvedValue(existingUser);

    const result = await facade.processSocialLogin({
      provider: 'github',
      socialUser: {
        id: 'provider-1',
        email: existingUser.email,
        nickname: 'nickname',
      },
    });

    expect(authService.issueTokens).toHaveBeenCalledWith(10n);
    expect(tiersService.getLowestTier).not.toHaveBeenCalled();
    expect(usersService.updateRefreshToken).toHaveBeenCalledWith(10n, 'refresh-token');
    expect(usersService.createSocialUser).not.toHaveBeenCalled();
    expect(gameSessionService.attachUserToSession).not.toHaveBeenCalled();
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('신규 유저 + gameSessionId이면 유저 생성 후 세션을 연결한다', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    authService.createRefreshToken.mockReturnValue('new-refresh-token');

    const createdUser = createMockUser({
      id: 99n,
      email: 'new@test.com',
      nickname: 'newbie',
      refreshToken: 'new-refresh-token',
    });
    usersService.createSocialUser.mockResolvedValue(createdUser);
    authService.createAccessToken.mockReturnValue('new-access-token');

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
      refreshToken: 'new-refresh-token',
      tierId: 1,
    });
    expect(gameSessionService.attachUserToSession).toHaveBeenCalledWith(777n, 99n);
    expect(authService.createAccessToken).toHaveBeenCalledWith(99n);
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });

  it('신규 유저 + gameSessionId 없음이면 세션 연결을 생략한다', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    authService.createRefreshToken.mockReturnValue('refresh-token');

    const createdUser = createMockUser({
      id: 55n,
      email: 'new2@test.com',
      nickname: 'new2',
      refreshToken: 'refresh-token',
    });
    usersService.createSocialUser.mockResolvedValue(createdUser);
    authService.createAccessToken.mockReturnValue('access-token');

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
