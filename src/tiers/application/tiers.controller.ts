import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TiersService } from './tiers.service';
import { TierDto, TiersResponseDto } from './tiers.dto';

@ApiTags('Tiers')
@Controller('tiers')
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @Get()
  @ApiOperation({ summary: '모든 티어 조회' })
  @ApiResponse({
    status: 200,
    description: '티어 목록 조회 성공',
    type: TiersResponseDto,
  })
  async getAllTiers(): Promise<TierDto[]> {
    return this.tiersService.getAllTiers();
  }
}
