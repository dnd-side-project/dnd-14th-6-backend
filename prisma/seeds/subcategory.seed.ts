import { PrismaClient, Prisma } from '@prisma/client';

export async function seedSubCategories(prisma: PrismaClient) {
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    console.warn('⚠️ No categories found. Run category seed first.');
    return;
  }

  const subCategoryData: Prisma.SubCategoryCreateManyInput[] = [];

  for (const cat of categories) {
    if (cat.name === 'Git') {
      subCategoryData.push(
        { name: 'Commit', categoryId: cat.id },
        { name: 'Branch', categoryId: cat.id },
        { name: 'Remote', categoryId: cat.id },
        { name: 'Undo', categoryId: cat.id },
        { name: 'Config', categoryId: cat.id },
        { name: 'Merge', categoryId: cat.id },
        { name: 'Rebase', categoryId: cat.id },
        { name: 'Stash', categoryId: cat.id },
        { name: 'Tag', categoryId: cat.id },
        { name: 'Log', categoryId: cat.id },
      );
    } else if (cat.name === 'Linux') {
      subCategoryData.push(
        { name: 'Shell', categoryId: cat.id },
        { name: 'File', categoryId: cat.id },
        { name: 'Permissions', categoryId: cat.id },
        { name: 'Process', categoryId: cat.id },
        { name: 'Network', categoryId: cat.id },
        { name: 'System', categoryId: cat.id },
        { name: 'User', categoryId: cat.id },
        { name: 'Disk', categoryId: cat.id },
        { name: 'Package', categoryId: cat.id },
        { name: 'Cron', categoryId: cat.id },
      );
    } else if (cat.name === 'Docker') {
      subCategoryData.push(
        { name: 'Container', categoryId: cat.id },
        { name: 'Image', categoryId: cat.id },
        { name: 'Volume', categoryId: cat.id },
        { name: 'Compose', categoryId: cat.id },
        { name: 'System', categoryId: cat.id },
        { name: 'Network', categoryId: cat.id },
        { name: 'Registry', categoryId: cat.id },
        { name: 'Build', categoryId: cat.id },
        { name: 'Log', categoryId: cat.id },
        { name: 'Security', categoryId: cat.id },
      );
    }
  }

  const result = await prisma.subCategory.createMany({
    data: subCategoryData,
    skipDuplicates: true,
  });

  console.log(`🌱 SubCategories seeded: ${result.count}`);
}
