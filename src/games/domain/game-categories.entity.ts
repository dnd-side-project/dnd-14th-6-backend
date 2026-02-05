export class GameCategory {
  private constructor(
    readonly id: number,
    readonly name: string,
  ) {}

  static from(data: Pick<GameCategory, 'id' | 'name'>): GameCategory {
    return new GameCategory(data.id, data.name);
  }
}
