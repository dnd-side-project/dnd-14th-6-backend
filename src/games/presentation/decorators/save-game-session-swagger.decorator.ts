import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  createSwaggerBadRequest,
  createSwaggerNotFound,
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';

import { MAX_PROBLEMS_PER_GAME } from '../../domain/game.business-rules';
import {
  SaveGameSessionRequestDto,
  SaveGameSessionResponseDto,
} from '../dto/save-game-session.dto';

export function ApiSaveGameSession() {
  return applyDecorators(
    ApiOperation({
      summary: '게임 세션 저장 ( 회원 / 비회원 공용 )',
      description:
        '게임 종료 후 게임 세션 결과를 저장합니다. <br> **(단, 회원/비회원 에 따라 응답데이터가 다릅니다.)**',
    }),
    ApiBody({
      type: SaveGameSessionRequestDto,
      examples: {
        '일부 정답 포함': {
          summary: '일부 문제를 맞춘 게임 세션',
          value: {
            categoryId: 1,
            difficultyMode: 'Easy',
            score: 30,
            clientAnswers: [
              {
                problemId: '73',
                inputs: [
                  { input: 'git branch', isCorrect: false },
                  { input: 'git remote', isCorrect: true },
                ],
                solved: true,
              },
              {
                problemId: '103',
                inputs: [
                  { input: 'git revert', isCorrect: false },
                  { input: 'git rolback', isCorrect: false },
                ],
                solved: false,
              },
              {
                problemId: '265',
                inputs: [{ input: 'git tag', isCorrect: true }],
                solved: true,
              },
              {
                problemId: '134',
                inputs: [{ input: 'git config --email "john@example.com"', isCorrect: false }],
                solved: false,
              },
              { problemId: '40', inputs: [], solved: false },
              {
                problemId: '34',
                inputs: [{ input: 'git branch', isCorrect: true }],
                solved: true,
              },
              { problemId: '4', inputs: [], solved: false },
              { problemId: '174', inputs: [], solved: false },
              { problemId: '306', inputs: [], solved: false },
              { problemId: '200', inputs: [], solved: false },
              {
                problemId: '237',
                inputs: [{ input: 'git stasy', isCorrect: false }],
                solved: false,
              },
              { problemId: '69', inputs: [], solved: false },
              { problemId: '11', inputs: [], solved: false },
              { problemId: '10', inputs: [], solved: false },
              { problemId: '6', inputs: [], solved: false },
              { problemId: '307', inputs: [], solved: false },
              { problemId: '7', inputs: [], solved: false },
              { problemId: '109', inputs: [], solved: false },
              { problemId: '241', inputs: [], solved: false },
              { problemId: '43', inputs: [], solved: false },
            ],
          },
        },
        '모두 오답': {
          summary: '아무것도 풀지 않은 게임 세션',
          value: {
            categoryId: 1,
            difficultyMode: 'Easy',
            score: 0,
            clientAnswers: [
              { problemId: '103', inputs: [], solved: false },
              { problemId: '136', inputs: [], solved: false },
              { problemId: '207', inputs: [], solved: false },
              { problemId: '273', inputs: [], solved: false },
              { problemId: '143', inputs: [], solved: false },
              { problemId: '40', inputs: [], solved: false },
              { problemId: '176', inputs: [], solved: false },
              { problemId: '109', inputs: [], solved: false },
              { problemId: '41', inputs: [], solved: false },
              { problemId: '265', inputs: [], solved: false },
              { problemId: '275', inputs: [], solved: false },
              { problemId: '11', inputs: [], solved: false },
              { problemId: '168', inputs: [], solved: false },
              { problemId: '9', inputs: [], solved: false },
              { problemId: '142', inputs: [], solved: false },
              { problemId: '242', inputs: [], solved: false },
              { problemId: '110', inputs: [], solved: false },
              { problemId: '201', inputs: [], solved: false },
              { problemId: '42', inputs: [], solved: false },
              { problemId: '43', inputs: [], solved: false },
            ],
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: '게임 세션 저장 성공',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                type: 'object',
                properties: {
                  data: { $ref: getSchemaPath(SaveGameSessionResponseDto) },
                },
              },
            ],
          },
          examples: {
            비회원: {
              summary: '비회원 응답',
              value: {
                statusCode: 201,
                success: true,
                data: {
                  gameSessionId: '1',
                },
              },
            },
            회원: {
              summary: '회원 응답 (totalScore 포함)',
              value: {
                statusCode: 201,
                success: true,
                data: {
                  gameSessionId: '1',
                  totalScore: '9999999',
                },
              },
            },
          },
        },
      },
    }),
    createSwaggerBadRequest([
      {
        description: 'categoryId를 보내지 않은 경우',
        message: 'categoryId는 필수값입니다.',
      },
      {
        description: 'categoryId가 정수가 아닌 경우',
        message: 'categoryId는 정수여야 합니다.',
      },
      {
        description: 'categoryId가 1 미만인 경우',
        message: 'categoryId는 1 이상이어야 합니다.',
      },
      {
        description: 'difficultyMode를 보내지 않은 경우',
        message: 'difficultyMode는 필수값입니다.',
      },
      {
        description: '유효하지 않은 난이도 모드',
        message: 'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다.',
      },
      {
        description: 'score가 정수가 아닌 경우',
        message: 'score는 정수여야 합니다.',
      },
      {
        description: 'score가 0 미만인 경우',
        message: 'score는 0 이상이어야 합니다.',
      },
      {
        description: 'clientAnswers가 배열이 아닌 경우',
        message: 'clientAnswers는 배열 형식이어야 합니다.',
      },
      {
        description: `clientAnswers가 정확히 ${MAX_PROBLEMS_PER_GAME}개가 아닌 경우 (빈 배열 포함)`,
        message: `clientAnswers는 정확히 ${MAX_PROBLEMS_PER_GAME}개여야 합니다.`,
      },
      {
        description: 'problemId가 숫자 문자열이 아닌 경우',
        message: 'problemId는 숫자 형식의 문자열이어야 합니다.',
      },
      {
        description: 'inputs가 배열이 아닌 경우',
        message: 'inputs는 배열 형식이어야 합니다.',
      },
      {
        description: 'solved가 boolean이 아닌 경우',
        message: 'solved는 boolean 타입이어야 합니다.',
      },
      {
        description: 'input이 문자열이 아닌 경우',
        message: 'input은 문자열이어야 합니다.',
      },
      {
        description: 'input이 빈 문자열인 경우',
        message: 'input은 필수값입니다.',
      },
      {
        description: 'input이 255자를 초과한 경우',
        message: 'input은 최대 255자까지 입력 가능합니다.',
      },
      {
        description: 'isCorrect가 boolean이 아닌 경우',
        message: 'isCorrect는 boolean 타입이어야 합니다.',
      },
      {
        description: 'solved=true인데 정답 처리된 입력(isCorrect=true)이 없는 경우',
        message: '데이터 무결성 오류: solved가 true이지만 정답 처리된 입력이 없습니다.',
      },
      {
        description: 'clientAnswers에 동일한 problemId가 2개 이상 포함된 경우',
        message: 'clientAnswers에 중복된 problemId가 포함되어 있습니다.',
      },
    ]),
    createSwaggerNotFound([
      {
        description: 'DB에 존재하지 않는 categoryId',
        message: '존재하지 않는 카테고리입니다.',
      },
      {
        description: 'DB에 존재하지 않는 problemId 포함',
        message: '존재하지 않는 문제 ID가 포함되어 있습니다.',
      },
    ]),

    ...createSwaggerServerErrors(),
  );
}
