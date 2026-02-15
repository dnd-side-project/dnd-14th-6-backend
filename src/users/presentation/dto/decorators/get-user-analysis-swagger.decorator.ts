import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  createSwaggerAuthErrors,
  createSwaggerBadRequest,
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';
import {
  FrequentWrongCategoryDto,
  FrequentWrongCommandDto,
  GetUserAnalysisResponseDto,
} from '../get-user-analysis.dto';

export function ApiGetUserAnalysis() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '유저 분석 (많이 틀린 카테고리, 자주 틀린 명령어) 조회' }),
    ApiParam({
      name: 'userId',
      description: '조회할 유저 ID',
      example: '1',
      type: 'string',
    }),
    ApiExtraModels(
      ApiResponseDto,
      GetUserAnalysisResponseDto,
      FrequentWrongCategoryDto,
      FrequentWrongCommandDto,
    ),
    ApiOkResponse({
      description: '유저 분석 정보 조회 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(GetUserAnalysisResponseDto) },
        },
      },
    }),
    createSwaggerBadRequest([
      { description: 'userId 필수 누락', message: 'userId는 필수값입니다.' },
      {
        description: '잘못된 userId 형식',
        message: 'userId가 유효한 숫자 형식의 문자열이 아닙니다.',
      },
    ]),
    ...createSwaggerAuthErrors(),
    ...createSwaggerServerErrors(),
  );
}
