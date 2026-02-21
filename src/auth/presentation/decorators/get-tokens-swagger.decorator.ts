import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  createSwaggerBadRequest,
  createSwaggerServerErrors,
  createSwaggerUnauthorized,
} from '@common/utils/swagger-error-response.util';

import { GetTokensResponseDto } from '../dto/get-tokens.dto';

export function ApiGetTokens() {
  return applyDecorators(
    ApiOperation({ summary: '인증용 코드로 토큰 발급' }),
    ApiExtraModels(ApiResponseDto, GetTokensResponseDto),
    ApiOkResponse({
      description: '토큰 발급 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(GetTokensResponseDto) },
        },
      },
    }),
    createSwaggerBadRequest([
      { description: 'code 필수 누락', message: 'code는 필수 값입니다.' },
      { description: '잘못된 code 형식', message: 'code가 유효한 토큰 형식이 아닙니다.' },
    ]),
    createSwaggerUnauthorized([
      {
        description: '코드 검증 실패',
        message: '유효하지 않은 인가 코드입니다.',
      },
    ]),
    ...createSwaggerServerErrors(),
  );
}
