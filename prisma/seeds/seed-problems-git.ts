import { PrismaClient, Difficulty } from '@prisma/client';
import { problems, ProblemSeedData } from './problems/git';

export async function seedGitProblems(prisma: PrismaClient) {
  console.log('🌱 Git 문제 시딩 시작...');

  let created = 0;
  let skipped = 0;

  // subCategoryId별로 그룹핑
  const grouped = new Map<number, ProblemSeedData[]>();
  for (const problem of problems) {
    const group = grouped.get(problem.subCategoryId) || [];
    group.push(problem);
    grouped.set(problem.subCategoryId, group);
  }

  for (const [subCategoryId, subProblems] of grouped) {
    // 해당 subCategory의 기존 title 목록을 한번에 조회
    const existingProblems = await prisma.problem.findMany({
      where: { subCategoryId },
      select: { title: true },
    });
    const existingTitles = new Set(existingProblems.map((p) => p.title));

    // 중복되지 않는 문제만 필터링
    const newProblems = subProblems.filter((p) => !existingTitles.has(p.title));
    skipped += subProblems.length - newProblems.length;

    if (newProblems.length === 0) continue;

    // 배치 insert
    const result = await prisma.problem.createMany({
      data: newProblems.map((p) => ({
        difficulty: p.difficulty as Difficulty,
        title: p.title,
        text: p.text,
        answer: p.answer,
        explanation: p.explanation,
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId,
      })),
    });
    created += result.count;
  }

  console.log(`✅ Git 문제 시딩 완료: ${created}개 생성, ${skipped}개 스킵 (중복)`);
}
