import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  createSwaggerAuthErrors,
  createSwaggerBadRequest,
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';
import {
  GetUserStatsResponseDto,
  CategoryScoreDto,
  ScoreDetailDto,
  TierDto,
} from '../dto/get-user-stats.dto';

export function ApiGetUserStats() {
  return applyDecorators(
    ApiBearerAuth(),
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
    createSwaggerBadRequest([
      { description: 'userId 필수 누락', message: 'userId는 필수값입니다.' },
      {
        description: '잘못된 userId 형식',
        message: 'userId가 유효한 숫자 형식의 문자열이 아닙니다.',
      },
    ]),
    ...createSwaggerAuthErrors(),
    ...createSwaggerServerErrors(),
  );
}
