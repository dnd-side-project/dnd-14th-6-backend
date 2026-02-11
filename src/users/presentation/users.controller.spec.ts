import { Test, TestingModule } from '@nestjs/testing';

import { Tier } from '@tiers/domain/tiers.entity';

import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';

import { User } from '../domain/users.entity';
import { CategoryScore, DifficultyScoreDetail, UserStats } from '../domain/user-stats.entity';

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

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      getRanksByPageAndSize: jest.fn(),
      getUserStats: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getRanks', () => {
    const mockTier = createMockTier({ name: 'gold' });
    let mockUsers: User[];
    let query: { page: number; size: number; tierId?: number };

    beforeEach(() => {
      mockUsers = [
        createMockUser({ nickname: 'user1', totalScore: 100n, tier: mockTier }),
        createMockUser({ nickname: 'user2', totalScore: 90n, tier: mockTier }),
      ];
      query = { page: 1, size: 20 };

      mockUsersService.getRanksByPageAndSize.mockResolvedValue([mockUsers, mockUsers.length]);
    });

    it('서비스를 호출하여 랭킹 데이터를 조회하는지 확인', async () => {
      await controller.getRanks(query);

      expect(mockUsersService.getRanksByPageAndSize).toHaveBeenCalledWith(
        query.page,
        query.size,
        undefined,
      );
    });

    it('유저 목록에 랭킹 정보가 같이 반환되는지 확인', async () => {
      const result = await controller.getRanks(query);

      expect(result.ranks).toHaveLength(2);
      expect(result.ranks[0].ranking).toBe(1);
      expect(result.ranks[0].nickname).toBe('user1');
      expect(result.ranks[1].ranking).toBe(2);
      expect(result.ranks[1].nickname).toBe('user2');
    });

    it('페이지네이션 메타데이터 정보가 반환되는지 확인', async () => {
      const result = await controller.getRanks(query);

      expect(result.metadata).toEqual({
        page: 1,
        size: 20,
        totalItems: 2,
        totalPage: 1,
      });
    });

    it('tierId가 있으면 서비스에 전달한다', async () => {
      query.tierId = 3;

      await controller.getRanks(query);

      expect(mockUsersService.getRanksByPageAndSize).toHaveBeenCalledWith(
        query.page,
        query.size,
        3,
      );
    });
  });

  describe('getUserStats', () => {
    const mockTier = createMockTier({ id: 3, name: 'Master' });
    const mockUserStats = UserStats.from({
      nickname: 'Jin Park',
      totalScore: 54610n,
      averageScore: 190293n,
      ranking: 131,
      tier: mockTier,
      scoreDetail: [
        DifficultyScoreDetail.from({
          difficultyMode: 'Hard',
          totalScore: 32460n,
          categoryScores: [
            CategoryScore.from({ category: 'Git', score: 17650n }),
            CategoryScore.from({ category: 'Linux', score: 11010n }),
          ],
        }),
      ],
    });

    beforeEach(() => {
      mockUsersService.getUserStats.mockResolvedValue(mockUserStats);
    });

    it('서비스를 호출하여 유저 통계를 조회하는지 확인', async () => {
      await controller.getUserStats({ userId: 1n });

      expect(mockUsersService.getUserStats).toHaveBeenCalledWith(1n);
    });

    it('유저 통계 응답 DTO가 올바르게 반환되는지 확인', async () => {
      const result = await controller.getUserStats({ userId: 1n });

      expect(result.nickname).toBe('Jin Park');
      expect(result.totalScore).toBe('54610');
      expect(result.averageScore).toBe('190293');
      expect(result.ranking).toBe(131);
    });

    it('티어 정보가 올바르게 반환되는지 확인', async () => {
      const result = await controller.getUserStats({ userId: 1n });

      expect(result.tier).toEqual({
        id: 3,
        name: 'Master',
        imageUrl: null,
      });
    });

    it('scoreDetail이 올바르게 반환되는지 확인', async () => {
      const result = await controller.getUserStats({ userId: 1n });

      expect(result.scoreDetail).toEqual([
        {
          difficultyMode: 'Hard',
          totalScore: '32460',
          categoryScores: [
            { category: 'Git', score: '17650' },
            { category: 'Linux', score: '11010' },
          ],
        },
      ]);
    });
  });
});
