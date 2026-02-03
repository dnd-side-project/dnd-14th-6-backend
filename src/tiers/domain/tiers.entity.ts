export class Tier {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly minScore: number,
    public readonly imageUrl: string | null,
    public readonly iconUrl: string | null,
  ) {}

  static from(data: {
    id: number;
    name: string;
    minScore: number;
    imageUrl: string | null;
    iconUrl: string | null;
  }): Tier {
    return new Tier(data.id, data.name, data.minScore, data.imageUrl, data.iconUrl);
  }
}
