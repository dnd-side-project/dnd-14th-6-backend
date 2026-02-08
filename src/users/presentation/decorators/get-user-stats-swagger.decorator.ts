import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  GetUserStatsResponseDto,
  CategoryScoreDto,
  ScoreDetailDto,
  TierDto,
} from '../dto/get-user-stats.dto';

export function ApiGetUserStats() {
  return applyDecorators(
    ApiOperation({ summary: '유저 스탯(누적 점수, 티어, 랭킹) 조회' }),
    ApiParam({
      name: 'userId',
      description: '조회할 유저 ID',
      example: '1',
      type: 'string',
    }),
    ApiExtraModels(
      ApiResponseDto,
      GetUserStatsResponseDto,
      CategoryScoreDto,
      ScoreDetailDto,
      TierDto,
    ),
    ApiOkResponse({
      description: '유저 스탯 조회 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(GetUserStatsResponseDto) },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation Failed (e.g. Invalid userId format)',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
    }),
    ApiResponse({
      status: 503,
      description: 'Service Unavailable',
    }),
  );
}
