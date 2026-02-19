import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@/common/dto/api-response.dto';
import {
  createSwaggerServerErrors,
  createSwaggerUnauthorized,
} from '@common/utils/swagger-error-response.util';

import { RefreshTokensResponseDto } from '../dto/refresh-tokens.dto';

export function ApiRefreshTokens() {
  return applyDecorators(
    ApiOperation({ summary: '리프레시 토큰으로 토큰 갱신' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          refreshToken: {
            type: 'string',
            description: '갱신할 리프레시 토큰(JWT)',
            example:
              'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjA5NDU5MTIwLCJleHAiOjE2MDk1NTI5MjB9.K2n4P...',
          },
        },
        required: ['refreshToken'],
      },
    }),
    ApiExtraModels(ApiResponseDto, RefreshTokensResponseDto),
    ApiOkResponse({
      description: '리프레시 토큰 갱신 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(RefreshTokensResponseDto) },
        },
      },
    }),
    createSwaggerUnauthorized([
      {
        description: '토큰 만료',
        message: '토큰이 만료되었습니다.',
      },
      {
        description: '토큰 변조',
        message: '유효하지 않은 토큰입니다.',
      },
      {
        description: '인증 누락',
        message: '인증이 필요합니다.',
      },
    ]),
    ...createSwaggerServerErrors(),
  );
}
