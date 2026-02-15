export class GameCategory {
  private constructor(
    readonly id: number,
    readonly name: string,
    readonly iconUrl: string,
  ) {}

  static from(data: Pick<GameCategory, 'id' | 'name' | 'iconUrl'>): GameCategory {
    return new GameCategory(data.id, data.name, data.iconUrl);
  }
}
