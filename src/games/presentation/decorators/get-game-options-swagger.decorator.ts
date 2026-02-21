import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import { createSwaggerServerErrors } from '@common/utils/swagger-error-response.util';

import { CategoryDto, GetGameOptionsResponseDto } from '../dto/get-game-options.dto';

export function ApiGetGameOptions() {
  return applyDecorators(
    ApiOperation({ summary: '게임 옵션 조회 (카테고리, 난이도) - ( Public )' }),
    ApiExtraModels(ApiResponseDto, GetGameOptionsResponseDto, CategoryDto),
    ApiOkResponse({
      description: '게임 옵션 조회 성공',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  data: { $ref: getSchemaPath(GetGameOptionsResponseDto) },
                },
              },
            ],
          },
        },
      },
    }),
    ...createSwaggerServerErrors(),
  );
}
