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
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';

import { GetMyInfoResponseDto } from '../dto/get-my-info.dto';

export function ApiGetMyInfo() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '내 정보 조회' }),
    ApiExtraModels(ApiResponseDto, GetMyInfoResponseDto),
    ApiOkResponse({
      description: '내 정보 조회 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(GetMyInfoResponseDto) },
        },
      },
    }),
    ...createSwaggerAuthErrors(),
    ...createSwaggerServerErrors(),
  );
}
