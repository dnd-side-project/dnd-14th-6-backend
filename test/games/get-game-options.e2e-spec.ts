import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { DIFFICULTY_MODES, GameDifficultyMode } from '@games/domain/game.business-rules';

import { seedCategories } from '../../prisma/seeds/category.seed';
import { AppModule } from '../../src/app.module';

interface GameOptionsApiResponse {
  statusCode: number;
  success: boolean;
  data: {
    categories: { id: number; name: string; iconUrl: string }[];
    difficultyModes: GameDifficultyMode[];
  };
}

describe('GET /api/games/options (e2e)', () => {
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

    // Prisma migrate & seed
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
    await seedCategories(prisma);
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

  it('게임옵션 정보를 정상적으로 응답한다.', async () => {
    const response = await request(app.getHttpServer()).get('/api/games/options').expect(200);
    const body = response.body as GameOptionsApiResponse;

    expect(body.success).toBe(true);
    expect(body.data.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          name: 'Git',
          iconUrl: 'https://cdn.orvit.net/categories/git.webp',
        }),
        expect.objectContaining({
          id: 2,
          name: 'Linux',
          iconUrl: 'https://cdn.orvit.net/categories/linux.webp',
        }),
        expect.objectContaining({
          id: 3,
          name: 'Docker',
          iconUrl: 'https://cdn.orvit.net/categories/docker.webp',
        }),
      ]),
    );
    expect(body.data.difficultyModes).toEqual(DIFFICULTY_MODES);
  });
});
