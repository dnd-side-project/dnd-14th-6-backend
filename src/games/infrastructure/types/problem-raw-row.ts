import { ProblemDifficulty } from '@games/domain/game.business-rules';

export interface ProblemRawRow {
  id: bigint;
  title: string;
  text: string;
  answer: string;
  difficulty: ProblemDifficulty;
  subCategoryName: string;
}
