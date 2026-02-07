import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import { GetRanksResponseDto } from '../dto/get-ranks.dto';

export function ApiGetRanks() {
  return applyDecorators(
    ApiOperation({ summary: '유저 전체, 티어별 랭킹 조회' }),
    ApiExtraModels(ApiResponseDto, GetRanksResponseDto),
    ApiOkResponse({
      description: '유저 랭킹 전체 조회 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(GetRanksResponseDto) },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation Failed (e.g. Query string, Body, Params)',
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
