// seed.ts
import { PrismaClient } from '@prisma/client';
import { seedCategories } from './seeds/category.seed';
import { seedTiers } from './seeds/tier.seed';
import { seedSubCategories } from './seeds/subcategory.seed';
import { seedUsersAndSessions } from './seeds/user-session.seed';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required for seeding');
}

const prisma = new PrismaClient();

type SeedFunction = (prisma: PrismaClient) => Promise<void>;

const seeds: Record<string, SeedFunction> = {
  tier: seedTiers,
  category: seedCategories,
  subcategory: seedSubCategories,
  user_session: seedUsersAndSessions, // user + game_session
};

async function main() {
  const targetSeed = process.argv[2];

  if (targetSeed) {
    // seed 파일 1개 실행
    const seedFn = seeds[targetSeed];
    if (!seedFn) {
      console.error(`Unknown seed: ${targetSeed}`);
      console.error(`Available seeds: ${Object.keys(seeds).join(', ')}`);
      process.exitCode = 1;
      return;
    }
    await seedFn(prisma);
    console.log(`🌱 Seed "${targetSeed}" completed!`);
  } else {
    // 전체 seed 실행 (순서 중요: Category -> SubCategory -> Problem)
    for (const [name, seedFn] of Object.entries(seeds)) {
      await seedFn(prisma);
      console.log(`🌱 Seed "${name}" completed!`);
    }
    console.log('🌱 All seed data created successfully!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
