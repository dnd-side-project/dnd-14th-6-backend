export class GameCategory {
  private constructor(
    readonly id: number,
    readonly name: string,
  ) {}

  // prisma model -> domain entity
  static from(data: Pick<GameCategory, 'id' | 'name'>): GameCategory {
    return new GameCategory(data.id, data.name);
  }
}
