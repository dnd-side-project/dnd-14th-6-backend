import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TiersService } from './tiers.service';

import { ITiersRepository, TIER_REPOSITORY } from '../domain/tiers.repository.interface';
import { Tier } from '../domain/tiers.entity';

describe('TiersService', () => {
  let service: TiersService;
  let mockTiersRepository: jest.Mocked<ITiersRepository>;

  beforeEach(async () => {
    mockTiersRepository = {
      findAll: jest.fn(),
      findLowestTier: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiersService,
        {
          provide: TIER_REPOSITORY,
          useValue: mockTiersRepository,
        },
      ],
    }).compile();

    service = module.get<TiersService>(TiersService);
  });

  describe('getAllTiers', () => {
    it('모든 티어 조회해 반환', async () => {
      const mockTiers: Tier[] = [
        new Tier(
          1,
          'Bronze',
          0,
          'https://example.com/bronze.png',
          'https://example.com/bronze-icon.png',
        ),
        new Tier(
          2,
          'Silver',
          100,
          'https://example.com/silver.png',
          'https://example.com/silver-icon.png',
        ),
        new Tier(
          3,
          'Gold',
          300,
          'https://example.com/gold.png',
          'https://example.com/gold-icon.png',
        ),
      ];
      mockTiersRepository.findAll.mockResolvedValue(mockTiers);

      const result = await service.getAllTiers();

      expect(result).toEqual(mockTiers);
      expect(mockTiersRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('티어 데이터가 없을 때 빈 배열 반환', async () => {
      mockTiersRepository.findAll.mockResolvedValue([]);

      const result = await service.getAllTiers();

      expect(result).toEqual([]);
      expect(mockTiersRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLowestTier', () => {
    it('최저 티어 조회해 반환', async () => {
      const mockTier = new Tier(
        1,
        'Bronze',
        0,
        'https://example.com/bronze.png',
        'https://example.com/bronze-icon.png',
      );
      mockTiersRepository.findLowestTier.mockResolvedValue(mockTier);

      const result = await service.getLowestTier();

      expect(result).toEqual(mockTier);
      expect(mockTiersRepository.findLowestTier).toHaveBeenCalledTimes(1);
    });

    it('최저 티어가 없으면 NotFoundException 발생', async () => {
      mockTiersRepository.findLowestTier.mockResolvedValue(null);

      await expect(service.getLowestTier()).rejects.toThrow(NotFoundException);
      expect(mockTiersRepository.findLowestTier).toHaveBeenCalledTimes(1);
    });
  });
});
