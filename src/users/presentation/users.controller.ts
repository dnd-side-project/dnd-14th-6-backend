import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '../application/users.service';

import { GetRanksQueryDto, GetRanksResponseDto } from './dto/get-ranks.dto';
import { GetUserAnalysisParamDto, GetUserAnalysisResponseDto } from './dto/get-user-analysis.dto';
import { GetUserStatsParamDto, GetUserStatsResponseDto } from './dto/get-user-stats.dto';

import { ApiGetRanks } from './decorators/get-ranks-swagger.decorator';
import { ApiGetUserStats } from './decorators/get-user-stats-swagger.decorator';
import { ApiGetUserAnalysis } from './dto/decorators/get-user-analysis-swagger.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/ranks')
  @ApiGetRanks()
  async getRanks(@Query() query: GetRanksQueryDto): Promise<GetRanksResponseDto> {
    const { page, size, tierId } = query;

    const [users, totalItems] = await this.usersService.getRanksByPageAndSize(page, size, tierId);

    return GetRanksResponseDto.from(users, totalItems, page, size);
  }

  @Get('/:userId/analysis')
  @ApiGetUserAnalysis()
  async getUserAnalysis(
    @Param() param: GetUserAnalysisParamDto,
  ): Promise<GetUserAnalysisResponseDto> {
    const userAnalysis = await this.usersService.getUserAnalysis(param.userId);

    return GetUserAnalysisResponseDto.from(userAnalysis);
  }

  // FIXME: auth gurad 들어올 경우 private으로 변경 필요
  @Get('/:userId/stats')
  @ApiGetUserStats()
  async getUserStats(@Param() param: GetUserStatsParamDto): Promise<GetUserStatsResponseDto> {
    const userStats = await this.usersService.getUserStats(param.userId);

    return GetUserStatsResponseDto.from(userStats);
  }
}
