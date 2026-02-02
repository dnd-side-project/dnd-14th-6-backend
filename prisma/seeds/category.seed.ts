import { PrismaClient } from '@prisma/client';

const categories = ['Git', 'Linux', 'Docker'];

export async function seedCategories(prisma: PrismaClient) {
  const result = await prisma.category.createMany({
    data: categories.map((name) => ({ name })),
    skipDuplicates: true, // 테이블 중복 삽입 방지
  });

  console.log(
    `🌱 Categories seeded: ${result.count} new, ${categories.length - result.count} skipped (already exist)`,
  );
}
