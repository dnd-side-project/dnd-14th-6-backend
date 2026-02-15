import { Difficulty } from '@prisma/client';

export interface ProblemRawRow {
  id: bigint;
  title: string;
  text: string;
  answer: string;
  difficulty: Difficulty;
  subCategoryName: string;
}
