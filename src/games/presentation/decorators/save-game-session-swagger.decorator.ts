import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SaveGameSessionRequestDto } from '../dto/save-game-session.dto';
import { MAX_PROBLEMS_PER_GAME } from '@/games/domain/game.business-rules';

export function ApiSaveGameSession() {
  return applyDecorators(
    ApiOperation({
      summary: '게임 세션 저장',
      description: '게임 종료 후 게임 세션 결과를 저장합니다.',
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

    // ── 201 성공 ──
    ApiResponse({
      status: HttpStatus.CREATED,
      description: '게임 세션 저장 성공',
      content: {
        'application/json': {
          example: {
            statusCode: 201,
            success: true,
            data: {
              gameSessionId: '1',
            },
          },
        },
      },
    }),

    // ── 400 유효성 검증 오류 ──
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: '유효성 검증 오류 / 데이터 무결성 오류',
      content: {
        'application/json': {
          examples: {
            // ── SaveGameSessionRequestDto ──
            'categoryId 필수 누락': {
              summary: 'categoryId를 보내지 않은 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'categoryId는 필수값입니다.',
              },
            },
            'categoryId 타입 오류': {
              summary: 'categoryId가 정수가 아닌 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'categoryId는 정수여야 합니다.',
              },
            },
            'categoryId 범위 오류': {
              summary: 'categoryId가 1 미만인 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'categoryId는 1 이상이어야 합니다.',
              },
            },
            'difficultyMode 필수 누락': {
              summary: 'difficultyMode를 보내지 않은 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'difficultyMode는 필수값입니다.',
              },
            },
            'difficultyMode 형식 오류': {
              summary: '유효하지 않은 난이도 모드',
              value: {
                statusCode: 400,
                success: false,
                message: 'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다.',
              },
            },
            'score 타입 오류': {
              summary: 'score가 정수가 아닌 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'score는 정수여야 합니다.',
              },
            },
            'score 범위 오류': {
              summary: 'score가 0 미만인 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'score는 0 이상이어야 합니다.',
              },
            },
            'clientAnswers 형식 오류': {
              summary: 'clientAnswers가 배열이 아닌 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'clientAnswers는 배열 형식이어야 합니다.',
              },
            },
            'clientAnswers 개수 초과': {
              summary: 'clientAnswers가 최대 개수를 초과한 경우',
              value: {
                statusCode: 400,
                success: false,
                message: `clientAnswers는 최대 ${MAX_PROBLEMS_PER_GAME}개까지 입력 가능합니다.`,
              },
            },

            // ── 비즈니스 로직 검증 (clientAnswers 개수) ──
            'clientAnswers 개수 불일치': {
              summary: `clientAnswers가 정확히 ${MAX_PROBLEMS_PER_GAME}개가 아닌 경우 (빈 배열 포함)`,
              value: {
                statusCode: 400,
                success: false,
                message: `clientAnswers는 ${MAX_PROBLEMS_PER_GAME}개여야 합니다.`,
              },
            },

            // ── ClientAnswerDto ──
            'problemId 형식 오류': {
              summary: 'problemId가 숫자 문자열이 아닌 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'problemId는 숫자 형식의 문자열이어야 합니다.',
              },
            },
            'inputs 형식 오류': {
              summary: 'inputs가 배열이 아닌 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'inputs는 배열 형식이어야 합니다.',
              },
            },
            'solved 타입 오류': {
              summary: 'solved가 boolean이 아닌 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'solved는 boolean 타입이어야 합니다.',
              },
            },

            // ── InputDto ──
            'input 타입 오류': {
              summary: 'input이 문자열이 아닌 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'input은 문자열이어야 합니다.',
              },
            },
            'input 필수 누락': {
              summary: 'input이 빈 문자열인 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'input은 필수값입니다.',
              },
            },
            'input 길이 초과': {
              summary: 'input이 255자를 초과한 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'input은 최대 255자까지 입력 가능합니다.',
              },
            },
            'isCorrect 타입 오류': {
              summary: 'isCorrect가 boolean이 아닌 경우',
              value: {
                statusCode: 400,
                success: false,
                message: 'isCorrect는 boolean 타입이어야 합니다.',
              },
            },

            // ── 비즈니스 로직 검증 ──
            '데이터 무결성 오류': {
              summary: 'solved=true인데 정답 처리된 입력(isCorrect=true)이 없는 경우',
              value: {
                statusCode: 400,
                success: false,
                message: '데이터 무결성 오류: solved가 true이지만 정답 처리된 입력이 없습니다.',
              },
            },
          },
        },
      },
    }),

    // ── 404 리소스 없음 ──
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '리소스를 찾을 수 없음',
      content: {
        'application/json': {
          examples: {
            '존재하지 않는 카테고리': {
              summary: 'DB에 존재하지 않는 categoryId',
              value: {
                statusCode: 404,
                success: false,
                message: '존재하지 않는 카테고리입니다.',
              },
            },
            '존재하지 않는 문제 ID': {
              summary: 'DB에 존재하지 않는 problemId 포함',
              value: {
                statusCode: 404,
                success: false,
                message: '존재하지 않는 문제 ID가 포함되어 있습니다. (problemId: 999)',
              },
            },
          },
        },
      },
    }),

    // ── 500 서버 오류 ──
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal Server Error',
    }),
  );
}
