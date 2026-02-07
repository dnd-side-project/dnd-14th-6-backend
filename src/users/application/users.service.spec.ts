import { Test, TestingModule } from '@nestjs/testing';

import { Tier } from '@tiers/domain/tiers.entity';

import { UsersService } from './users.service';

import { IUsersRepository, USER_REPOSITORY } from '../domain/users.repository.interface';
import { User } from '../domain/users.entity';

function createMockTier(overrides: Partial<Tier> = {}): Tier {
  return Tier.from({
    id: 1,
    name: 'bronze',
    minScore: 0,
    imageUrl: null,
    iconUrl: null,
    ...overrides,
  });
}

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

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: jest.Mocked<IUsersRepository>;

  beforeEach(async () => {
    mockUsersRepository = {
      findAllOrderByScoreDesc: jest.fn(),
      countAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('getRanksByPageAndSize', () => {
    let mockUsers: User[];

    beforeEach(() => {
      mockUsers = [
        createMockUser({ nickname: 'user1', totalScore: 100n, tier: createMockTier() }),
        createMockUser({
          nickname: 'user2',
          totalScore: 94n,
          tier: createMockTier({ name: 'silver' }),
        }),
      ];

      mockUsersRepository.findAllOrderByScoreDesc.mockResolvedValue(mockUsers);
      mockUsersRepository.countAll.mockResolvedValue(mockUsers.length);
    });

    it('파라미터 정보로 유저 목록 조회하는지 확인', async () => {
      const page = 2;
      const size = 10;

      await service.getRanksByPageAndSize(page, size);

      expect(mockUsersRepository.findAllOrderByScoreDesc).toHaveBeenCalledWith(
        page,
        size,
        undefined,
      );
    });

    it('파라미터 정보로 전체 개수 조회하는지 확인', async () => {
      const page = 2;
      const size = 10;
      const tierId = 1;

      await service.getRanksByPageAndSize(page, size, tierId);

      expect(mockUsersRepository.countAll).toHaveBeenCalledWith(tierId);
    });

    it('유저 목록과 개수 정보를 튜플로 반환하는지 확인', async () => {
      const page = 2;
      const size = 10;
      const tierId = 1;

      const ret = await service.getRanksByPageAndSize(page, size, tierId);

      expect(ret).toEqual([mockUsers, mockUsers.length]);
    });
  });
});
