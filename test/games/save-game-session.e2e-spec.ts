import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../src/app.module';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { seedCategories } from '../../prisma/seeds/category.seed';
import { seedSubCategories } from '../../prisma/seeds/subcategory.seed';
import { seedGitProblems } from '../../prisma/seeds/seed-problems-git';
import { MAX_PROBLEMS_PER_GAME } from '@games/domain/game.business-rules';

interface SuccessResponse {
  statusCode: number;
  success: boolean;
  data: {
    gameSessionId: string;
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
    await seedCategories(prisma);
    await seedSubCategories(prisma);
    await seedGitProblems(prisma);
    await prisma.$disconnect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    await app.init();
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  describe('✅ 성공 케이스', () => {
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
      expect(body.message).toContain('categoryId');
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
      expect(body.message).toContain('difficultyMode');
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
      expect(body.message).toContain('difficultyMode');
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
      expect(body.message).toContain('score');
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
      expect(body.message).toContain('clientAnswers');
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
      expect(body.message).toContain('clientAnswers');
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
      expect(body.message).toContain('clientAnswers');
    });

    it('존재하지 않는 카테고리면 404 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 999,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: [],
        })
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toContain('카테고리');
    });

    it('존재하지 않는 문제 ID가 포함되어 있으면 404 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 0,
          clientAnswers: [{ problemId: '999999', inputs: [], solved: false }],
        })
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toContain('문제 ID');
    });

    it('solved=true인데 정답 처리된 입력이 없으면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games/save')
        .send({
          categoryId: 1,
          difficultyMode: 'Easy',
          score: 10,
          clientAnswers: [
            {
              problemId: '1',
              inputs: [{ input: 'wrong', isCorrect: false }],
              solved: true,
            },
          ],
        })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toContain('무결성');
    });
  });
});
