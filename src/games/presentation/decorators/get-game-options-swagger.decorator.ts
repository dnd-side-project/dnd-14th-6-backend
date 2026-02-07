import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { GetGameOptionsResponseDto } from '../dto/get-game-options.dto';

export function ApiGetGameOptions() {
  return applyDecorators(
    ApiOperation({ summary: '게임 옵션 조회 (카테고리, 난이도)' }),
    ApiExtraModels(GetGameOptionsResponseDto),
    ApiOkResponse({
      description: '게임 옵션 조회 성공',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          success: { type: 'boolean', example: true },
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
