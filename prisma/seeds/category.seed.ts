import { PrismaClient } from '@prisma/client';

const categories = [
  { name: 'Git', iconUrl: 'https://cdn.orvit.net/categories/git.png' },
  { name: 'Linux', iconUrl: 'https://cdn.orvit.net/categories/linux.png' },
  { name: 'Docker', iconUrl: 'https://cdn.orvit.net/categories/docker.png' },
];

export async function seedCategories(prisma: PrismaClient) {
  const result = await prisma.category.createMany({
    data: categories.map((category) => ({ name: category.name, iconUrl: category.iconUrl })),
    skipDuplicates: true,
  });

  console.log(
    `🌱 Categories seeded: ${result.count} new, ${categories.length - result.count} skipped (already exist)`,
  );
}
