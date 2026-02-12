import { PrismaClient, Prisma } from '@prisma/client';

export async function seedSubCategories(prisma: PrismaClient) {
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    console.warn('⚠️ No categories found. Run category seed first.');
    return;
  }

  const subCategoryMap: Record<string, string[]> = {
    Git: ['Commit', 'Branch', 'Remote', 'Undo', 'Config', 'Merge', 'Rebase', 'Stash', 'Tag', 'Log'],
    Linux: [
      'Shell',
      'File',
      'Permissions',
      'Process',
      'Network',
      'System',
      'User',
      'Disk',
      'Package',
      'Cron',
    ],
    Docker: [
      'Container',
      'Image',
      'Volume',
      'Compose',
      'System',
      'Network',
      'Registry',
      'Build',
      'Log',
      'Security',
    ],
  };

  const existing = await prisma.subCategory.findMany({
    select: { name: true, categoryId: true },
  });
  const existingSet = new Set(existing.map((s) => `${s.categoryId}:${s.name}`));

  const subCategoryData: Prisma.SubCategoryCreateManyInput[] = [];
  for (const cat of categories) {
    const subCategoryNames = subCategoryMap[cat.name];
    if (subCategoryNames) {
      for (const name of subCategoryNames) {
        if (!existingSet.has(`${cat.id}:${name}`)) {
          subCategoryData.push({ name, categoryId: cat.id });
        }
      }
    }
  }

  if (subCategoryData.length === 0) {
    console.log('🌱 SubCategories already seeded. Skipped.');
    return;
  }

  const result = await prisma.subCategory.createMany({ data: subCategoryData });
  console.log(`🌱 SubCategories seeded: ${result.count}`);
}
