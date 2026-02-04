export class Tier {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly minScore: number,
    public readonly imageUrl: string | null,
    public readonly iconUrl: string | null,
  ) {}

  static from(data: Pick<Tier, 'id' | 'name' | 'minScore' | 'imageUrl' | 'iconUrl'>): Tier {
    return new Tier(data.id, data.name, data.minScore, data.imageUrl, data.iconUrl);
  }
}
