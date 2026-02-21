import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { MAX_PROBLEMS_PER_GAME } from '@games/domain/game.business-rules';

import { seedCategories } from '../../prisma/seeds/category.seed';
import { seedGitProblems } from '../../prisma/seeds/seed-problems-git';
import { seedSubCategories } from '../../prisma/seeds/subcategory.seed';
import { seedTiers } from '../../prisma/seeds/tier.seed';
import { AppModule } from '../../src/app.module';

interface SuccessResponse {
  statusCode: number;
  success: boolean;
  data: {
    gameSessionId: string;
    totalScore?: string;
  };
}

interface ErrorResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

describe('POST /api/games/save (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedTestContainer;
  let accessToken: string;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:16-alpine')
      .withExposedPorts(5432)
      .withEnvironment({
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
        POSTGRES_DB: 'test',
      })
      .start();

    const databaseUrl = `postgresql://test:test@${container.getHost()}:${container.getMappedPort(5432)}/test`;
    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
    await seedTiers(prisma);
    await seedCategories(prisma);
    await seedSubCategories(prisma);
    await seedGitProblems(prisma);

    await prisma.user.create({
      data: {
        email: 'test@example.com',
        nickname: 'tester',
        provider: 'google',
        providerId: 'test-provider-id',
        refreshToken: 'dummy-refresh-token',
        tierId: 1,
      },
    });

    await prisma.$disconnect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    await app.init();

    const jwtService = app.get(JwtService);
    accessToken = jwtService.sign({ sub: '1' });
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  describe('✅ 성공 케이스', () => {
    describe('비회원', () => {
      it('모든 문제를 풀지 못해 0점인 게임 세션을 저장한다.', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/games/save')
          .send({
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
          })
          .expect(201);

        const body = response.body as SuccessResponse;
        expect(body.success).toBe(true);
        expect(body.data.gameSessionId).toBeDefined();
      });

      it('일부 문제를 맞춘 게임 세션을 저장한다.', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/games/save')
          .send({
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
          })
          .expect(201);

        const body = response.body as SuccessResponse;
        expect(body.success).toBe(true);
        expect(body.data.gameSessionId).toBeDefined();
      });
    });
    describe('회원', () => {
      it('모든 문제를 풀지 못해 0점인 게임 세션을 저장하고 totalScore를 응답한다.', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/games/save')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            categoryId: 1,
            difficultyMode: 'Easy',
            score: 0,
            clientAnswers: [
              { problemId: '2', inputs: [], solved: false },
              { problemId: '3', inputs: [], solved: false },
              { problemId: '4', inputs: [], solved: false },
              { problemId: '5', inputs: [], solved: false },
              { problemId: '6', inputs: [], solved: false },
              { problemId: '7', inputs: [], solved: false },
              { problemId: '8', inputs: [], solved: false },
              { problemId: '13', inputs: [], solved: false },
              { problemId: '14', inputs: [], solved: false },
              { problemId: '15', inputs: [], solved: false },
              { problemId: '35', inputs: [], solved: false },
              { problemId: '36', inputs: [], solved: false },
              { problemId: '37', inputs: [], solved: false },
              { problemId: '38', inputs: [], solved: false },
              { problemId: '67', inputs: [], solved: false },
              { problemId: '68', inputs: [], solved: false },
              { problemId: '69', inputs: [], solved: false },
              { problemId: '100', inputs: [], solved: false },
              { problemId: '101', inputs: [], solved: false },
              { problemId: '102', inputs: [], solved: false },
            ],
          })
          .expect(201);

        const body = response.body as SuccessResponse;
        expect(body.success).toBe(true);
        expect(body.data.gameSessionId).toBeDefined();
        expect(body.data.totalScore).toBe('0');
      });

      it('일부 문제를 맞춘 게임 세션을 저장하고 누적된 totalScore를 응답한다.', async () => {
        // 맞춘 문제: ID 1(Easy=10점), ID 12(Normal=30점), ID 23(Hard=50점) → 서버 계산 점수 90점
        const response = await request(app.getHttpServer())
          .post('/api/games/save')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            categoryId: 1,
            difficultyMode: 'Random',
            score: 90,
            clientAnswers: [
              {
                problemId: '1',
                inputs: [{ input: 'git init', isCorrect: true }],
                solved: true,
              },
              {
                problemId: '12',
                inputs: [
                  { input: 'git commit', isCorrect: false },
                  { input: 'git commit --amend', isCorrect: true },
                ],
                solved: true,
              },
              {
                problemId: '23',
                inputs: [{ input: 'git rebase -i HEAD~3', isCorrect: true }],
                solved: true,
              },
              { problemId: '34', inputs: [], solved: false },
              { problemId: '45', inputs: [], solved: false },
              { problemId: '56', inputs: [], solved: false },
              { problemId: '70', inputs: [], solved: false },
              { problemId: '71', inputs: [], solved: false },
              { problemId: '72', inputs: [], solved: false },
              { problemId: '73', inputs: [], solved: false },
              { problemId: '74', inputs: [], solved: false },
              { problemId: '75', inputs: [], solved: false },
              { problemId: '76', inputs: [], solved: false },
              { problemId: '133', inputs: [], solved: false },
              { problemId: '134', inputs: [], solved: false },
              { problemId: '166', inputs: [], solved: false },
              { problemId: '199', inputs: [], solved: false },
              { problemId: '232', inputs: [], solved: false },
              { problemId: '265', inputs: [], solved: false },
              { problemId: '298', inputs: [], solved: false },
            ],
          })
          .expect(201);

        const body = response.body as SuccessResponse;
        expect(body.success).toBe(true);
        expect(body.data.gameSessionId).toBeDefined();
        // 이전 게임(0점) + 현재 게임(90점) = 총 90점
        expect(body.data.totalScore).toBe('90');
      });

      it('첫 게임 플레이 후 DB의 user.totalScore가 게임 점수로 업데이트된다.', async () => {
        const dbUrl = `postgresql://test:test@${container.getHost()}:${container.getMappedPort(5432)}/test`;
        const prisma = new PrismaClient({ datasourceUrl: dbUrl });

        try {
          // 테스트 전용 유저 생성 (초기 totalScore = 0)
          const user = await prisma.user.create({
            data: {
              email: 'score-update-test@example.com',
              nickname: 'score-tester',
              provider: 'google',
              providerId: 'score-update-test',
              refreshToken: 'dummy-refresh-token',
              tierId: 1,
            },
          });
          expect(user.totalScore).toBe(0n);

          const jwtService = app.get(JwtService);
          const token = jwtService.sign({ sub: String(user.id) });

          // 맞춘 문제: ID 1(Easy=10점), ID 12(Normal=30점), ID 23(Hard=50점) → 서버 계산 점수 90점
          const response = await request(app.getHttpServer())
            .post('/api/games/save')
            .set('Authorization', `Bearer ${token}`)
            .send({
              categoryId: 1,
              difficultyMode: 'Random',
              score: 90,
              clientAnswers: [
                {
                  problemId: '1',
                  inputs: [{ input: 'git init', isCorrect: true }],
                  solved: true,
                },
                {
                  problemId: '12',
                  inputs: [
                    { input: 'git commit', isCorrect: false },
                    { input: 'git commit --amend', isCorrect: true },
                  ],
                  solved: true,
                },
                {
                  problemId: '23',
                  inputs: [{ input: 'git rebase -i HEAD~3', isCorrect: true }],
                  solved: true,
                },
                { problemId: '34', inputs: [], solved: false },
                { problemId: '45', inputs: [], solved: false },
                { problemId: '56', inputs: [], solved: false },
                { problemId: '70', inputs: [], solved: false },
                { problemId: '71', inputs: [], solved: false },
                { problemId: '72', inputs: [], solved: false },
                { problemId: '73', inputs: [], solved: false },
                { problemId: '74', inputs: [], solved: false },
                { problemId: '75', inputs: [], solved: false },
                { problemId: '76', inputs: [], solved: false },
                { problemId: '133', inputs: [], solved: false },
                { problemId: '134', inputs: [], solved: false },
                { problemId: '166', inputs: [], solved: false },
                { problemId: '199', inputs: [], solved: false },
                { problemId: '232', inputs: [], solved: false },
                { problemId: '265', inputs: [], solved: false },
                { problemId: '298', inputs: [], solved: false },
              ],
            })
            .expect(201);

          const body = response.body as SuccessResponse;
          expect(body.success).toBe(true);
          expect(body.data.totalScore).toBe('90');

          // DB에서 직접 조회하여 user.totalScore가 실제로 업데이트되었는지 확인
          const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
          });
          expect(updatedUser!.totalScore).toBe(90n);
        } finally {
          await prisma.$disconnect();
        }
      });
    });
  });

  describe('❌ 실패 케이스 - RequestBody 유효성 검증', () => {
    it('categoryId를 누락하면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: [],
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe(
        'categoryId는 1 이상이어야 합니다., categoryId는 정수여야 합니다., categoryId는 필수값입니다., clientAnswers는 정확히 20개여야 합니다.',
      );
    });

    it('difficultyMode를 누락하면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          score: 0,
          clientAnswers: [],
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe(
        'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다., difficultyMode는 필수값입니다., clientAnswers는 정확히 20개여야 합니다.',
      );
    });

    it('잘못된 difficultyMode를 보내면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'InvalidMode',
          score: 0,
          clientAnswers: [],
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe(
        'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다., clientAnswers는 정확히 20개여야 합니다.',
      );
    });

    it('score가 음수이면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: -1,
          clientAnswers: [],
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe(
        'score는 0 이상이어야 합니다., clientAnswers는 정확히 20개여야 합니다.',
      );
    });

    it('clientAnswers가 배열이 아니면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: 'not-an-array',
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe(
        'clientAnswers는 정확히 20개여야 합니다., clientAnswers는 정확히 20개여야 합니다., clientAnswers는 배열 형식이어야 합니다., each value in nested property clientAnswers must be either object or array',
      );
    });

    it(`clientAnswers가 ${MAX_PROBLEMS_PER_GAME}개 미만이면 400 에러를 응답한다.`, async () => {
      const underSizedAnswers = Array.from({ length: MAX_PROBLEMS_PER_GAME - 1 }, (_, i) => ({
        problemId: String(i + 1),
        inputs: [],
        solved: false,
      }));

      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: underSizedAnswers,
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('clientAnswers는 정확히 20개여야 합니다.');
    });

    it(`clientAnswers가 ${MAX_PROBLEMS_PER_GAME}개를 초과하면 400 에러를 응답한다.`, async () => {
      const oversizedAnswers = Array.from({ length: MAX_PROBLEMS_PER_GAME + 1 }, (_, i) => ({
        problemId: String(i + 1),
        inputs: [],
        solved: false,
      }));

      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: oversizedAnswers,
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('clientAnswers는 정확히 20개여야 합니다.');
    });

    it('problemId가 숫자 형식이 아니면 400 에러를 응답한다.', async () => {
      await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: [{ problemId: 'abc', inputs: [], solved: false }],
        })
        .expect(400);
    });

    it('solved가 boolean이 아니면 400 에러를 응답한다.', async () => {
      await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: [{ problemId: '1', inputs: [], solved: 'yes' }],
        })
        .expect(400);
    });

    it('input이 빈 문자열이면 400 에러를 응답한다.', async () => {
      await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: [
            {
              problemId: '1',
              inputs: [{ input: '', isCorrect: false }],
              solved: false,
            },
          ],
        })
        .expect(400);
    });
  });

  describe('❌ 실패 케이스 - 비즈니스 로직 검증', () => {
    it('clientAnswers가 빈 배열이면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Random',
          score: 0,
          clientAnswers: [],
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('clientAnswers는 정확히 20개여야 합니다.');
    });

    it('존재하지 않는 카테고리면 404 에러를 응답한다.', async () => {
      const dummyAnswers = Array.from({ length: MAX_PROBLEMS_PER_GAME }, (_, i) => ({
        problemId: String(i + 1),
        inputs: [],
        solved: false,
      }));

      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 999,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: dummyAnswers,
        })
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('존재하지 않는 카테고리입니다.');
    });

    it('clientAnswers에 중복된 problemId가 포함되어 있으면 400 에러를 응답한다.', async () => {
      const answersWithDuplicateProblem = [
        { problemId: '73', inputs: [], solved: false },
        { problemId: '73', inputs: [], solved: false },
        ...Array.from({ length: MAX_PROBLEMS_PER_GAME - 2 }, (_, i) => ({
          problemId: String(i + 1),
          inputs: [],
          solved: false,
        })),
      ];

      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: answersWithDuplicateProblem,
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('clientAnswers에 중복된 problemId가 포함되어 있습니다.');
    });

    it('존재하지 않는 문제 ID가 포함되어 있으면 404 에러를 응답한다.', async () => {
      const answersWithInvalidProblem = [
        { problemId: '999999', inputs: [], solved: false },
        ...Array.from({ length: MAX_PROBLEMS_PER_GAME - 1 }, (_, i) => ({
          problemId: String(i + 1),
          inputs: [],
          solved: false,
        })),
      ];

      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: answersWithInvalidProblem,
        })
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('존재하지 않는 문제 ID가 포함되어 있습니다. (problemId: 999999)');
    });

    it('solved=true인데 정답 처리된 입력이 없으면 400 에러를 응답한다.', async () => {
      const answersWithIntegrityError = [
        {
          problemId: '1',
          inputs: [{ input: 'wrong', isCorrect: false }],
          solved: true,
        },
        ...Array.from({ length: MAX_PROBLEMS_PER_GAME - 1 }, (_, i) => ({
          problemId: String(i + 2),
          inputs: [],
          solved: true,
        })),
      ];

      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 10,
          clientAnswers: answersWithIntegrityError,
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe(
        '데이터 무결성 오류: solved가 true이지만 정답 처리된 입력이 없습니다.',
      );
    });
  });
});
