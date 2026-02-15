import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';

import { createSwaggerServerErrors } from '@/common/utils/swagger-error-response.util';
import { ApiResponseDto } from '@common/dto/api-response.dto';

import { CategoryDto, GetGameOptionsResponseDto } from '../dto/get-game-options.dto';

export function ApiGetGameOptions() {
  return applyDecorators(
    ApiOperation({ summary: '게임 옵션 조회 (카테고리, 난이도)' }),
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
          example: {
            statusCode: 200,
            success: true,
            data: {
              categories: [
                { id: 1, name: 'Git', iconUrl: 'https://cdn.orvit.net/categories/git.png' },
                { id: 2, name: 'Linux', iconUrl: 'https://cdn.orvit.net/categories/linux.png' },
                { id: 3, name: 'Docker', iconUrl: 'https://cdn.orvit.net/categories/docker.png' },
              ],
              difficultyModes: ['Easy', 'Normal', 'Hard', 'Random'],
            },
          },
        },
      },
    }),
    ...createSwaggerServerErrors(),
  );
}
