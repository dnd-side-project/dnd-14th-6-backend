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
      );
    } else if (cat.name === 'Linux') {
      subCategoryData.push(
        { name: 'Shell', categoryId: cat.id },
        { name: 'Permissions', categoryId: cat.id },
      );
    } else if (cat.name === 'Docker') {
      subCategoryData.push(
        { name: 'Container', categoryId: cat.id },
        { name: 'Image', categoryId: cat.id },
      );
    }
  }

  const result = await prisma.subCategory.createMany({
    data: subCategoryData,
    skipDuplicates: true,
  });

  console.log(`🌱 SubCategories seeded: ${result.count}`);
}
