import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/presentation/guards/jwt-auth.guard';
import { UserOwnershipGuard } from '@auth/presentation/guards/user-ownership.guard';
import { CheckOwnership } from '@auth/presentation/decorators/check-ownership.decorator';

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

  /**
   * @description 특정 유저의 실수 분석 조회 (본인만 가능)
   */
  @Get('/:userId/analysis')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @CheckOwnership('userId')
  @ApiGetUserAnalysis()
  async getUserAnalysis(
    @Param() param: GetUserAnalysisParamDto,
  ): Promise<GetUserAnalysisResponseDto> {
    const userAnalysis = await this.usersService.getUserAnalysis(param.userId);

    return GetUserAnalysisResponseDto.from(userAnalysis);
  }

  /**
   * @description 특정 유저의 통계 조회 (본인만 가능)
   */
  @Get('/:userId/stats')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @CheckOwnership('userId')
  @ApiGetUserStats()
  async getUserStats(@Param() param: GetUserStatsParamDto): Promise<GetUserStatsResponseDto> {
    const userStats = await this.usersService.getUserStats(param.userId);

    return GetUserStatsResponseDto.from(userStats);
  }
}
