import { Test, TestingModule } from '@nestjs/testing';

import { TiersController } from './tiers.controller';
import { TiersService } from '../application/tiers.service';

import { Tier } from '../domain/tiers.entity';

describe('TiersController', () => {
  let controller: TiersController;
  let mockTiersService: jest.Mocked<TiersService>;

  beforeEach(async () => {
    mockTiersService = {
      getAllTiers: jest.fn(),
    } as unknown as jest.Mocked<TiersService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiersController],
      providers: [
        {
          provide: TiersService,
          useValue: mockTiersService,
        },
      ],
    }).compile();

    controller = module.get<TiersController>(TiersController);
  });

  describe('getAllTiers', () => {
    it('모든 티어 데이터 반환', async () => {
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
      ];
      mockTiersService.getAllTiers.mockResolvedValue(mockTiers);

      const result = await controller.getAllTiers();

      expect(result).toEqual(mockTiers);
      expect(mockTiersService.getAllTiers).toHaveBeenCalledTimes(1);
    });

    it('티어 데이터가 없을 경우 빈 배열 반환', async () => {
      mockTiersService.getAllTiers.mockResolvedValue([]);

      const result = await controller.getAllTiers();

      expect(result).toEqual([]);
    });
  });
});
