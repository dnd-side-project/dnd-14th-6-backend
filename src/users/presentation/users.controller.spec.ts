import { Test, TestingModule } from '@nestjs/testing';

import {
  FrequentWrongCategory,
  FrequentWrongCommand,
  UserMistakeAnalysis,
} from '@games/domain/user-mistake-analysis.entity';
import { Tier } from '@tiers/domain/tiers.entity';

import { UsersFacade } from '../application/users.facade';
import { UsersService } from '../application/users.service';
import { CategoryScore, DifficultyScoreDetail, UserStats } from '../domain/user-stats.entity';
import { DEFAULT_PROFILE_IMAGE, RankScope } from '../domain/user.business-rule';
import { User } from '../domain/users.entity';
import { UsersController } from './users.controller';

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
    profileImage: DEFAULT_PROFILE_IMAGE,
    tierId: null,
    tier: null,
    ...overrides,
  });
}

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockUsersFacade: jest.Mocked<UsersFacade>;

  beforeEach(async () => {
    mockUsersService = {
      findById: jest.fn(),
      getRanksByPageAndSize: jest.fn(),
      getUserStats: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    mockUsersFacade = {
      getUserAnalysis: jest.fn(),
    } as unknown as jest.Mocked<UsersFacade>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: UsersFacade,
          useValue: mockUsersFacade,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getMyInfo', () => {
    const mockUser = createMockUser({
      id: 1n,
      nickname: 'John',
      profileImage: 'https://example.com/profile.png',
    });
    const userId = 1n;

    beforeEach(() => {
      mockUsersService.findById.mockResolvedValue(mockUser);
    });

    it('조회한 유저의 id, 닉네임, 프로필 이미지가 올바르게 반환되는지 확인', async () => {
      const result = await controller.getMyInfo({ userId });

      expect(result).toEqual({
        id: '1',
        nickname: 'John',
        profileImage: 'https://example.com/profile.png',
      });
    });

    it('유저 조회 중 에러 발생 시 에러 전파하는지 확인', async () => {
      const expectedError = new Error('Test Error');

      mockUsersService.findById.mockRejectedValue(expectedError);

      await expect(controller.getMyInfo({ userId })).rejects.toThrow(expectedError);
    });
  });

  describe('getRanks', () => {
    const mockTier = createMockTier({ name: 'gold' });
    let mockUsers: User[];

    beforeEach(() => {
      mockUsers = [
        createMockUser({ nickname: 'user1', totalScore: 100n, tier: mockTier }),
        createMockUser({ nickname: 'user2', totalScore: 90n, tier: mockTier }),
      ];

      mockUsersService.getRanksByPageAndSize.mockResolvedValue([mockUsers, mockUsers.length]);
    });

    it('scope와 userId를 서비스에 전달하는지 확인', async () => {
      const query = { page: 1, size: 20, scope: RankScope.All };
      const user = { userId: undefined };

      await controller.getRanks(query, user);

      expect(mockUsersService.getRanksByPageAndSize).toHaveBeenCalledWith(
        1,
        20,
        RankScope.All,
        undefined,
      );
    });

    it('로그인 유저의 userId를 서비스에 전달하는지 확인', async () => {
      const query = { page: 1, size: 20, scope: RankScope.Tier };
      const user = { userId: 1n };

      await controller.getRanks(query, user);

      expect(mockUsersService.getRanksByPageAndSize).toHaveBeenCalledWith(
        1,
        20,
        RankScope.Tier,
        1n,
      );
    });

    it('유저 목록에 랭킹 정보가 같이 반환되는지 확인', async () => {
      const result = await controller.getRanks(
        { page: 1, size: 20, scope: RankScope.All },
        { userId: undefined },
      );

      expect(result.ranks).toHaveLength(2);
      expect(result.ranks[0].ranking).toBe(1);
      expect(result.ranks[0].nickname).toBe('user1');
      expect(result.ranks[1].ranking).toBe(2);
      expect(result.ranks[1].nickname).toBe('user2');
    });

    it('페이지네이션 메타데이터 정보가 반환되는지 확인', async () => {
      const result = await controller.getRanks(
        { page: 1, size: 20, scope: RankScope.All },
        { userId: undefined },
      );

      expect(result.metadata).toEqual({
        page: 1,
        size: 20,
        totalItems: 2,
        totalPage: 1,
      });
    });
  });

  describe('getUserAnalysis', () => {
    const userId = 1n;
    let mockAnalysis: UserMistakeAnalysis;

    beforeEach(() => {
      const mockCommands = [
        FrequentWrongCommand.from({ category: 'Git', subCategory: 'Branch', wrongCount: 12 }),
        FrequentWrongCommand.from({ category: 'Git', subCategory: 'Commit', wrongCount: 9 }),
        FrequentWrongCommand.from({ category: 'Git', subCategory: 'Merge', wrongCount: 7 }),
      ];

      const mockCategories = [
        FrequentWrongCategory.from({
          category: 'Git',
          wrongRatio: 48,
          wrongCount: 24,
          iconUrl: 'https://example.com/git.png',
        }),
        FrequentWrongCategory.from({
          category: 'Docker',
          wrongRatio: 30,
          wrongCount: 12,
          iconUrl: 'https://example.com/docker.png',
        }),
      ];

      mockAnalysis = UserMistakeAnalysis.from({
        frequentWrongCommands: mockCommands,
        frequentWrongCategories: mockCategories,
      });

      mockUsersFacade.getUserAnalysis.mockResolvedValue(mockAnalysis);
    });

    it('서비스를 호출하여 사용자 실수 분석 데이터를 조회하는지 확인', async () => {
      await controller.getUserAnalysis({ userId });

      expect(mockUsersFacade.getUserAnalysis).toHaveBeenCalledWith(userId);
    });

    it('자주 틀린 명령어 목록이 반환되는지 확인', async () => {
      const result = await controller.getUserAnalysis({ userId });

      expect(result.frequentWrongCommands).toHaveLength(3);
      expect(result.frequentWrongCommands[0]).toMatchObject({
        category: 'Git',
        subCategory: 'Branch',
        wrongCount: 12,
      });
    });

    it('자주 틀린 카테고리 목록에 iconUrl이 포함되어 반환되는지 확인', async () => {
      const result = await controller.getUserAnalysis({ userId });

      expect(result.frequentWrongCategories).toHaveLength(2);
      expect(result.frequentWrongCategories[0]).toMatchObject({
        category: 'Git',
        wrongRatio: 48,
        wrongCount: 24,
        iconUrl: 'https://example.com/git.png',
      });
    });

    it('오답 비율이 높은 순으로 정렬되어 있는지 확인', async () => {
      const result = await controller.getUserAnalysis({ userId });

      expect(result.frequentWrongCategories[0].wrongRatio).toBeGreaterThan(
        result.frequentWrongCategories[1].wrongRatio,
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
