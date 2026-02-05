import { Tier } from '@tiers/domain/tiers.entity';

export class User {
  constructor(
    public readonly id: bigint,
    public readonly email: string,
    public readonly nickname: string,
    public readonly provider: string,
    public readonly providerId: string,
    public readonly totalScore: bigint,
    public readonly refreshToken: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly githubUrl: string | null,
    public readonly profileImage: string | null,
    public readonly tierId: number | null,
    public readonly tier: Tier | null,
  ) {}

  static from(
    data: Pick<
      User,
      | 'id'
      | 'email'
      | 'nickname'
      | 'provider'
      | 'providerId'
      | 'totalScore'
      | 'refreshToken'
      | 'createdAt'
      | 'updatedAt'
      | 'githubUrl'
      | 'profileImage'
      | 'tierId'
      | 'tier'
    >,
  ): User {
    return new User(
      data.id,
      data.email,
      data.nickname,
      data.provider,
      data.providerId,
      data.totalScore,
      data.refreshToken,
      data.createdAt,
      data.updatedAt,
      data.githubUrl,
      data.profileImage,
      data.tierId,
      data.tier,
    );
  }
}
