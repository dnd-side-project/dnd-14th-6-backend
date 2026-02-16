import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { GetUserStatsResponseDto } from '@users/presentation/dto/get-user-stats.dto';

import { seedCategories } from '../../prisma/seeds/category.seed';
import { seedSubCategories } from '../../prisma/seeds/subcategory.seed';
import { seedTiers } from '../../prisma/seeds/tier.seed';
import { seedUsersAndSessions } from '../../prisma/seeds/user-session.seed';
import { AppModule } from '../../src/app.module';

describe('GET /api/users/:userId/stats (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedTestContainer;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:18-alpine')
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
    await seedUsersAndSessions(prisma);

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
    await app.close();
    await container.stop();
  });

  it('존재하지 않는 유저 id로 요청 시 404 에러를 응답한다.', async () => {
    await request(app.getHttpServer()).get('/api/users/9999/stats').expect(404);
  });

  it('존재하는 유저로 요청 시 난이도와 카테고리 별로 올바른 정보를 응답한다.', async () => {
    const response = await request(app.getHttpServer()).get('/api/users/1/stats').expect(200);
    const body = response.body as { data: GetUserStatsResponseDto } & ApiResponseDto;

    expect(body.data.totalScore).toBe('54610');
    expect(body.data.ranking).toBe(131);

    const hardMode = body.data.scoreDetail.find((detail) => detail.difficultyMode === 'Hard');
    expect(hardMode).toBeDefined();
    expect(hardMode?.totalScore).toBe('32460');

    const gitCategory = hardMode?.categoryScores.find((cat) => cat.category === 'Git');
    expect(gitCategory).toBeDefined();
    expect(gitCategory?.score).toBe('17650');
  });
});
