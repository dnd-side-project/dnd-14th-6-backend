import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaClient } from '@prisma/client';
import { AuthService } from '@auth/application/auth.service';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { ExceptionResponse } from '@common/interfaces/exception-response.interface';
import { GetRanksResponseDto, RankItemDto } from '@users/presentation/dto/get-ranks.dto';

import { seedCategories } from '../../prisma/seeds/category.seed';
import { seedSubCategories } from '../../prisma/seeds/subcategory.seed';
import { seedTiers } from '../../prisma/seeds/tier.seed';
import { seedUsersAndSessions } from '../../prisma/seeds/user-session.seed';
import { AppModule } from '../../src/app.module';

describe('GET /api/users/ranks (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedTestContainer;
  let accessToken: string;

  // user-session.seed.ts 기준 시드 데이터 수
  // Master: ranker 130명 + Jin Park 1명 = 131명
  // Gold: newbie 50명
  const TOTAL_USERS = 181;
  const MASTER_USERS = 131;
  const DEFAULT_SIZE = 20;

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

    const testUser = await prisma.user.findUnique({ where: { email: 'jinpark@example.com' } });
    await prisma.$disconnect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    await app.init();

    const authService = moduleFixture.get(AuthService);
    accessToken = authService.createAccessToken(testUser!.id);
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  it('scope=tier 일 때, 비회원일 경우 403 에러를 응답한다.', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/ranks?scope=tier')
      .expect(403);

    const body = response.body as ApiResponseDto & ExceptionResponse;

    expect(body.success).toBe(false);
    expect(body.message).toBe('티어 랭킹 조회는 회원만 가능합니다.');
  });

  it('scope 없이 요청 시 전체 랭킹을 조회한다.', async () => {
    const response = await request(app.getHttpServer()).get('/api/users/ranks').expect(200);

    const body = response.body as ApiResponseDto & { data: GetRanksResponseDto };

    expect(body.success).toBe(true);
    expect(body.data.ranks).toHaveLength(DEFAULT_SIZE);
    expect(body.data.metadata).toMatchObject({
      page: 1,
      size: DEFAULT_SIZE,
      totalItems: TOTAL_USERS,
      totalPage: Math.ceil(TOTAL_USERS / DEFAULT_SIZE),
    });

    expect(body.data.ranks[0].ranking).toBe(1);

    const scores = body.data.ranks.map((r: RankItemDto) => Number(r.totalScore));
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('page, size 파라미터로 페이지네이션이 정상 동작한다.', async () => {
    const page = 2;
    const size = 10;
    const response = await request(app.getHttpServer())
      .get(`/api/users/ranks?page=${page}&size=${size}`)
      .expect(200);

    const body = response.body as ApiResponseDto & { data: GetRanksResponseDto };

    expect(body.data.ranks).toHaveLength(size);
    expect(body.data.metadata).toMatchObject({
      page,
      size,
      totalItems: TOTAL_USERS,
      totalPage: Math.ceil(TOTAL_USERS / size),
    });

    expect(body.data.ranks[0].ranking).toBe((page - 1) * size + 1);
  });

  it('scope=tier 일 때, 회원일 경우 자신과 같은 티어의 랭킹을 조회한다.', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/ranks?scope=tier')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = response.body as ApiResponseDto & { data: GetRanksResponseDto };

    expect(body.success).toBe(true);
    expect(body.data.metadata.totalItems).toBe(MASTER_USERS);
    expect(body.data.ranks).toHaveLength(DEFAULT_SIZE);

    body.data.ranks.forEach((rank: RankItemDto) => {
      expect(rank.tier?.name).toBe('Master');
    });
  });

  it('page가 1 미만일 경우 400 에러를 응답한다.', async () => {
    const response = await request(app.getHttpServer()).get('/api/users/ranks?page=0').expect(400);

    const body = response.body as ApiResponseDto & ExceptionResponse;

    expect(body.success).toBe(false);
    expect(body.message).toBe('page의 최솟값은 1입니다.');
  });

  it('유효하지 않은 scope 값으로 요청 시 400 에러를 응답한다.', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/ranks?scope=invalid')
      .expect(400);

    const body = response.body as ApiResponseDto & ExceptionResponse;

    expect(body.success).toBe(false);
    expect(body.message).toBe('랭킹 scope는 tier, all 중 하나여야 합니다.');
  });
});
