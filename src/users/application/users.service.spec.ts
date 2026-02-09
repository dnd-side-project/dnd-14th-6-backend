import { Test, TestingModule } from '@nestjs/testing';

import { Tier } from '@tiers/domain/tiers.entity';

import { UsersService } from './users.service';

import { IUsersRepository, USER_REPOSITORY } from '../domain/users.repository.interface';
import { User } from '../domain/users.entity';
import { GamesService } from '@games/application/games.service';
import {
  UserMistakeAnalysis,
  FrequentWrongCommand,
  FrequentWrongCategory,
} from '@games/domain/user-mistake-analysis.entity';

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
  let mockGamesService: jest.Mocked<GamesService>;

  beforeEach(async () => {
    mockUsersRepository = {
      findAllOrderByScoreDesc: jest.fn(),
      countAll: jest.fn(),
    };

    mockGamesService = {
      getUserMistakeAnalysis: jest.fn(),
    } as unknown as jest.Mocked<GamesService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUsersRepository,
        },
        {
          provide: GamesService,
          useValue: mockGamesService,
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

  describe('getUserAnalysis', () => {
    const userId = 1n;
    let mockAnalysis: UserMistakeAnalysis;

    beforeEach(() => {
      const mockCommands = [
        FrequentWrongCommand.from({ subCategory: 'Branch', wrongCount: 12 }),
        FrequentWrongCommand.from({ subCategory: 'Commit', wrongCount: 9 }),
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

      mockGamesService.getUserMistakeAnalysis.mockResolvedValue(mockAnalysis);
    });

    it('GamesService를 호출하여 사용자 실수 분석을 조회하는지 확인', async () => {
      await service.getUserAnalysis(userId);

      expect(mockGamesService.getUserMistakeAnalysis).toHaveBeenCalledWith(userId);
    });

    it('GamesService에서 받은 분석 결과를 그대로 반환하는지 확인', async () => {
      const result = await service.getUserAnalysis(userId);

      expect(result).toBe(mockAnalysis);
      expect(result.frequentWrongCommands).toHaveLength(2);
      expect(result.frequentWrongCategories).toHaveLength(2);
    });

    it('카테고리에 iconUrl이 포함되어 있는지 확인', async () => {
      const result = await service.getUserAnalysis(userId);

      expect(result.frequentWrongCategories[0].iconUrl).toBe('https://example.com/git.png');
      expect(result.frequentWrongCategories[1].iconUrl).toBe('https://example.com/docker.png');
    });
  });
});
