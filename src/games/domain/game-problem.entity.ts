import { ProblemDifficulty } from './game.business-rules';

export class GameProblem {
  private constructor(
    readonly id: bigint,
    readonly title: string,
    readonly subCategoryName: string,
    readonly text: string,
    readonly answer: string,
    readonly point: number,
    readonly difficulty: ProblemDifficulty,
  ) {}

  static from(
    data: Pick<
      GameProblem,
      'id' | 'title' | 'subCategoryName' | 'text' | 'answer' | 'point' | 'difficulty'
    >,
  ) {
    return new GameProblem(
      data.id,
      data.title,
      data.subCategoryName,
      data.text,
      data.answer,
      data.point,
      data.difficulty,
    );
  }
}
