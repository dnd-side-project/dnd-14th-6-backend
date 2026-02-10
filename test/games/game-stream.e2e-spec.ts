import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as request from 'supertest';
import * as http from 'http';
import { AddressInfo } from 'net';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../src/app.module';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { seedCategories } from '../../prisma/seeds/category.seed';
import { seedSubCategories } from '../../prisma/seeds/subcategory.seed';

interface ErrorResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

describe('GET /api/games/stream (e2e)', () => {
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
    await prisma.problem.createMany({
      data: [
        {
          difficulty: 'EASY',
          title: 'Test Problem 1',
          text: 'What is git init?',
          answer: 'git init',
          explanation: 'Initializes a new git repository',
          categoryId: 1,
          subCategoryId: 1,
        },
        {
          difficulty: 'EASY',
          title: 'Test Problem 2',
          text: 'What is git status?',
          answer: 'git status',
          explanation: 'Shows the working tree status',
          categoryId: 1,
          subCategoryId: 1,
        },
      ],
    });
    await prisma.$disconnect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    await app.listen(0);
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  function getBaseUrl(): string {
    const address = (app.getHttpServer() as http.Server).address() as AddressInfo;
    return `http://localhost:${address.port}`;
  }

  describe('✅ 성공 케이스', () => {
    it('유효한 요청으로 SSE 스트림이 시작되면 text/event-stream 헤더와 timer 이벤트를 수신한다.', (done) => {
      const req = http.get(
        `${getBaseUrl()}/api/games/stream?categoryId=1&difficultyMode=Easy`,
        (res) => {
          expect(res.statusCode).toBe(200);
          expect(res.headers['content-type']).toBe('text/event-stream');
          expect(res.headers['cache-control']).toBe('no-cache');

          let data = '';
          res.on('data', (chunk: Buffer) => {
            data += chunk.toString();

            // 완전한 SSE 이벤트(event + data + 빈줄) 수신 대기
            if (data.includes('event: timer') && data.includes('data: ') && data.includes('\n\n')) {
              expect(data).toContain('"success":true');
              expect(data).toContain('"remainingSeconds"');
              req.destroy();
              done();
            }
          });
        },
      );

      req.on('error', () => {
        // req.destroy() 호출 시 발생하는 에러는 무시
      });
    });
  });

  describe('❌ 실패 케이스', () => {
    it('categoryId를 누락하면 400 에러를 JSON 형식으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/games/stream?difficultyMode=Easy')
        .expect(400)
        .expect('Content-Type', /json/);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(400);
      expect(body.message).toContain('categoryId');
    });

    it('difficultyMode를 누락하면 400 에러를 JSON 형식으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/games/stream?categoryId=1')
        .expect(400)
        .expect('Content-Type', /json/);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(400);
      expect(body.message).toContain('difficultyMode');
    });

    it('쿼리 파라미터를 모두 누락하면 400 에러를 JSON 형식으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/games/stream')
        .expect(400)
        .expect('Content-Type', /json/);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(400);
    });

    it('잘못된 difficultyMode로 요청하면 400 에러를 JSON 형식으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/games/stream?categoryId=1&difficultyMode=InvalidMode')
        .expect(400)
        .expect('Content-Type', /json/);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(400);
    });

    it('존재하지 않는 카테고리로 요청하면 404 에러를 JSON 형식으로 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/games/stream?categoryId=999&difficultyMode=Easy')
        .expect(404)
        .expect('Content-Type', /json/);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(404);
      expect(body.message).toContain('카테고리');
    });
  });
});
