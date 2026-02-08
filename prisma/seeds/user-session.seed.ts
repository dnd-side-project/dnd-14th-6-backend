import { PrismaClient, Prisma } from '@prisma/client';

export async function seedUsersAndSessions(prisma: PrismaClient) {
  const masterTier = await prisma.tier.findUnique({ where: { name: 'Master' } });
  const goldTier = await prisma.tier.findUnique({ where: { name: 'Gold' } });

  const git = await prisma.category.findUnique({ where: { name: 'Git' } });
  const linux = await prisma.category.findUnique({ where: { name: 'Linux' } });
  const docker = await prisma.category.findUnique({ where: { name: 'Docker' } });

  if (!masterTier || !goldTier || !git || !linux || !docker) {
    console.error('❌ Pre-requisite data (Tier or Category) missing.');
    return;
  }

  /**
   * 타겟 유저 생성 (Jin Park)
   * Total Score: 54,610 (Master)
   */
  const targetUser = await prisma.user.upsert({
    where: { email: 'jinpark@example.com' },
    update: {},
    create: {
      email: 'jinpark@example.com',
      nickname: 'Jin Park',
      provider: 'local',
      providerId: 'google',
      profileImage: 'https://placehold.co/200',
      totalScore: 54610n,
      tierId: masterTier.id,
      refreshToken: 'dummy_token',
    },
  });

  console.log(`👤 Target User "Jin Park" created (ID: ${targetUser.id})`);

  /**
   * 랭킹/평균 점수용 더미 유저 생성
   * 타겟 유저보다 점수 높은 사람 : 130명
   * 타겟 유저보다 점수 낮은 사람 : 50명
   */
  const dummyUsers: Prisma.UserCreateManyInput[] = [];
  // (1) 랭커들 (55,000 ~ 100,000 점)
  for (let i = 1; i <= 130; i++) {
    dummyUsers.push({
      email: `ranker${i}@test.com`,
      nickname: `Ranker${i}`,
      provider: 'test',
      providerId: `ranker_${i}`,
      totalScore: BigInt(55000 + i * 100),
      tierId: masterTier.id,
      refreshToken: 'dummy',
    });
  }
  // (2) 하위 유저들 (1,000 ~ 50,000 점)
  for (let i = 1; i <= 50; i++) {
    dummyUsers.push({
      email: `newbie${i}@test.com`,
      nickname: `Newbie${i}`,
      provider: 'test',
      providerId: `newbie_${i}`,
      totalScore: BigInt(1000 + i * 100),
      tierId: goldTier.id,
      refreshToken: 'dummy',
    });
  }

  await prisma.user.createMany({
    data: dummyUsers,
    skipDuplicates: true,
  });
  console.log(`👥 Dummy Users seeded: ${dummyUsers.length}`);

  /**
   * gameSession 데이터 생성 (Jin Park의 점수 내역)
   * 중복 방지용으로 사전 데이터 제거
   */
  await prisma.gameSession.deleteMany({ where: { userId: targetUser.id } });

  const sessions = [
    // [Hard] Total: 32,460
    { difficultyMode: 'Hard', categoryId: git.id, score: 17650 },
    { difficultyMode: 'Hard', categoryId: linux.id, score: 11010 },
    { difficultyMode: 'Hard', categoryId: docker.id, score: 3800 },

    // [Normal] Total: 15,000
    { difficultyMode: 'Normal', categoryId: git.id, score: 10000 },
    { difficultyMode: 'Normal', categoryId: linux.id, score: 5000 },

    // [Easy] Total: 7,150
    { difficultyMode: 'Easy', categoryId: git.id, score: 7150 },
  ];

  for (const session of sessions) {
    await prisma.gameSession.create({
      data: {
        userId: targetUser.id,
        difficultyMode: session.difficultyMode,
        categoryId: session.categoryId,
        score: session.score,
        totalProblemCount: 10,
        correctProblemCount: 8,
      },
    });
  }

  console.log(`🎮 Game Sessions for dummy user created: ${sessions.length}`);
}
