import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  FrequentWrongCategoryDto,
  FrequentWrongCommandDto,
  GetUserAnalysisResponseDto,
} from '../get-user-analysis.dto';

export function ApiGetUserAnalysis() {
  return applyDecorators(
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
    ApiResponse({
      status: 400,
      description: 'Validation Failed (e.g. Invalid userId format)',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
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
