import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { Tier } from '@tiers/domain/tiers.entity';

import { UsersService } from './users.service';

import {
  IUsersRepository,
  ScoreDetailRaw,
  USER_REPOSITORY,
} from '../domain/users.repository.interface';
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
      findByIdWithTier: jest.fn(),
      getAverageScore: jest.fn(),
      getRankingByScore: jest.fn(),
      getScoreDetailByUserId: jest.fn(),
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

  describe('getUserStats', () => {
    const mockTier = createMockTier({ id: 3, name: 'Master' });
    const mockUser = createMockUser({
      id: 1n,
      nickname: 'Jin Park',
      totalScore: 54610n,
      tier: mockTier,
    });
    const mockScoreDetail: ScoreDetailRaw[] = [
      { difficultyMode: 'Hard', category: 'Git', totalScore: 17650n },
      { difficultyMode: 'Hard', category: 'Linux', totalScore: 11010n },
      { difficultyMode: 'Normal', category: 'Git', totalScore: 8500n },
    ];

    beforeEach(() => {
      mockUsersRepository.findByIdWithTier.mockResolvedValue(mockUser);
      mockUsersRepository.getAverageScore.mockResolvedValue(190294n);
      mockUsersRepository.getRankingByScore.mockResolvedValue(131);
      mockUsersRepository.getScoreDetailByUserId.mockResolvedValue(mockScoreDetail);
    });

    it('유저 ID로 통계 정보를 조회하는지 확인', async () => {
      await service.getUserStats(1n);

      expect(mockUsersRepository.findByIdWithTier).toHaveBeenCalledWith(1n);
      expect(mockUsersRepository.getAverageScore).toHaveBeenCalled();
      expect(mockUsersRepository.getScoreDetailByUserId).toHaveBeenCalledWith(1n);
    });

    it('유저가 없으면 NotFoundException을 던지는지 확인', async () => {
      mockUsersRepository.findByIdWithTier.mockResolvedValue(null);

      await expect(service.getUserStats(999n)).rejects.toThrow(NotFoundException);
    });

    it('유저 통계 정보를 반환하는지 확인', async () => {
      const result = await service.getUserStats(1n);

      expect(result.nickname).toBe('Jin Park');
      expect(result.totalScore).toBe(54610n);
      expect(result.averageScore).toBe(190294n);
      expect(result.ranking).toBe(131);
      expect(result.tier?.name).toBe('Master');
    });

    it('scoreDetail이 totalScore 기준 DESC로 정렬되는지 확인', async () => {
      const result = await service.getUserStats(1n);

      expect(result.scoreDetail[0].difficultyMode).toBe('Hard');
      expect(result.scoreDetail[0].totalScore).toBe(28660n);
      expect(result.scoreDetail[1].difficultyMode).toBe('Normal');
      expect(result.scoreDetail[1].totalScore).toBe(8500n);
    });

    it('categoryScores가 score 기준 DESC로 정렬되는지 확인', async () => {
      const result = await service.getUserStats(1n);

      const hardDetail = result.scoreDetail.find((d) => d.difficultyMode === 'Hard');
      expect(hardDetail?.categoryScores[0].category).toBe('Git');
      expect(hardDetail?.categoryScores[0].score).toBe(17650n);
      expect(hardDetail?.categoryScores[1].category).toBe('Linux');
      expect(hardDetail?.categoryScores[1].score).toBe(11010n);
    });

    it('유저 totalScore로 랭킹을 조회하는지 확인', async () => {
      await service.getUserStats(1n);

      expect(mockUsersRepository.getRankingByScore).toHaveBeenCalledWith(54610n);
    });

    it('유저의 스코어 정보가 없을 경우 빈 배열 반환하는지 확인', async () => {
      mockUsersRepository.getScoreDetailByUserId.mockResolvedValue([]);

      const result = await service.getUserStats(1n);

      expect(result.scoreDetail).toEqual([]);
    });
  });
});
