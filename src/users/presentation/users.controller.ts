import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../application/users.service';
import { GetRanksQueryDto, GetRanksResponseDto, RanksResponseDto } from './dto/get-ranks.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/ranks')
  @ApiOperation({ summary: '유저 전체, 티어별 랭킹 조회' })
  @ApiResponse({
    status: 200,
    description: '유저 랭킹 전체 조회 성공',
    type: RanksResponseDto,
  })
  async getRanks(@Query() query: GetRanksQueryDto): Promise<GetRanksResponseDto> {
    const { page, size, tierId } = query;

    const [users, totalItems] = await this.usersService.getRanksByPageAndSize(page, size, tierId);

    return GetRanksResponseDto.from(users, totalItems, page, size);
  }
}
