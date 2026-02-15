import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  createSwaggerAuthErrors,
  createSwaggerBadRequest,
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';

import { GetGameHistoriesResponseDto } from '../dto/get-game-histories.dto';

export function ApiGetGameHistories() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '게임 세션 히스토리 목록 조회' }),
    ApiExtraModels(ApiResponseDto, GetGameHistoriesResponseDto),
    ApiOkResponse({
      description: '세션 히스토리 조회 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(GetGameHistoriesResponseDto) },
        },
      },
    }),
    createSwaggerBadRequest([
      { description: 'userId 누락', message: 'userId 는 필수값입니다.' },
      {
        description: 'userId 형식 오류',
        message: 'userId가 유효한 숫자 형식의 문자열이 아닙니다.',
      },
      { description: 'page가 정수 아님', message: 'page가 정수가 아닙니다.' },
      { description: 'page 최솟값 미만', message: 'page의 최솟값은 1입니다.' },
      { description: 'size가 정수 아님', message: 'size가 정수가 아닙니다.' },
      { description: 'size 최솟값 미만', message: 'size의 최솟값은 1입니다.' },
      { description: 'startDate 형식 오류', message: 'startDate는 YYYY-MM-DD 형식이어야 합니다.' },
      { description: 'endDate 형식 오류', message: 'endDate는 YYYY-MM-DD 형식이어야 합니다.' },
      {
        description: 'difficultyModes 형식 오류',
        message: '게임 난이도는 Random, Hard, Normal, Easy 중 하나여야 합니다.',
      },
      {
        description: 'sortBy 값 오류',
        message: 'sortBy는 playedAt, score, correctProblemCount 중 하나여야 합니다.',
      },
      {
        description: 'sortOrder 값 오류',
        message: 'sortOrder는 asc, desc 중 하나여야 합니다.',
      },
    ]),
    ...createSwaggerAuthErrors(),
    ...createSwaggerServerErrors(),
  );
}
