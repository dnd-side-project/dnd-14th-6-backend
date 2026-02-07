import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import { GetGameOptionsResponseDto } from '../dto/get-game-options.dto';

export function ApiGetGameOptions() {
  return applyDecorators(
    ApiOperation({ summary: '게임 옵션 조회 (카테고리, 난이도)' }),
    ApiExtraModels(ApiResponseDto, GetGameOptionsResponseDto),
    ApiOkResponse({
      description: '게임 옵션 조회 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(GetGameOptionsResponseDto) },
        },
      },
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
