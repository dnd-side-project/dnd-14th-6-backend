import { PrismaClient } from '@prisma/client';

const categories = [
  { name: 'Git', iconUrl: 'https://cdn.orvit.net/categories/git.webp' },
  { name: 'Linux', iconUrl: 'https://cdn.orvit.net/categories/linux.webp' },
  { name: 'Docker', iconUrl: 'https://cdn.orvit.net/categories/docker.webp' },
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
