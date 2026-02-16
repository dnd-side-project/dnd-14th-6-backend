import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import {
  createSwaggerServerErrors,
  createSwaggerUnauthorized,
} from '@common/utils/swagger-error-response.util';

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
    ApiOkResponse({
      description: '리프레시 토큰 갱신 성공',
      headers: {
        'Set-Cookie': {
          description: 'accessToken, refreshToken이 Set-Cookie 헤더로 내려감',
        },
      },
      content: {
        'application/json': {
          example: {
            statusCode: 200,
            success: true,
          },
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
