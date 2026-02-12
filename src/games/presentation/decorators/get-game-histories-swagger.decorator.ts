import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import { GetGameHistoriesResponseDto } from '../dto/get-game-histories.dto';

export function ApiGetGameHistories() {
  return applyDecorators(
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
    ApiBadRequestResponse({
      description: '잘못된 요청 파라미터',
      content: {
        'application/json': {
          examples: {
            invalidUserId: {
              summary: 'userId가 유효하지 않은 경우',
              value: {
                status: 400,
                success: false,
                message: 'userId가 유효한 숫자 형식의 문자열이 아닙니다.',
              },
            },
            invalidSortBy: {
              summary: 'sortBy 값이 유효하지 않은 경우',
              value: {
                status: 400,
                success: false,
                message: 'sortBy는 playedAt, score, correctProblemCount 중 하나여야 합니다.',
              },
            },
            invalidSortOrder: {
              summary: 'sortOrder 값이 유효하지 않은 경우',
              value: {
                status: 400,
                success: false,
                message: 'sortOrder는 asc, desc 중 하나여야 합니다.',
              },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
    ApiResponse({ status: 503, description: 'Service Unavailable' }),
  );
}
