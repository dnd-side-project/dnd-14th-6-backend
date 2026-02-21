import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  createSwaggerBadRequest,
  createSwaggerForbidden,
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';

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
    createSwaggerBadRequest([
      { description: 'page가 정수 아님', message: 'page가 정수가 아닙니다.' },
      { description: 'page 최솟값 미만', message: 'page의 최솟값은 1입니다.' },
      { description: 'size가 정수 아님', message: 'size가 정수가 아닙니다.' },
      { description: 'size 최솟값 미만', message: 'size의 최솟값은 1입니다.' },
      { description: 'scope 값 오류', message: '랭킹 scope는 tier, all 중 하나여야 합니다.' },
    ]),
    createSwaggerForbidden([
      { description: '조회 권한 오류', message: '티어 랭킹 조회는 회원만 가능합니다.' },
    ]),
    ...createSwaggerServerErrors(),
  );
}
