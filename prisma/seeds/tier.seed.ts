// seeds/tier.seed.ts
import { PrismaClient } from '@prisma/client';

export async function seedTiers(prisma: PrismaClient) {
  const tiers = [
    {
      id: 1,
      name: 'Bronze',
      minScore: 0,
      imageUrl: 'https://placehold.co/100/cd7f32/white?text=B',
      iconUrl: 'icon_b',
    },
    {
      id: 2,
      name: 'Silver',
      minScore: 5000,
      imageUrl: 'https://placehold.co/100/c0c0c0/white?text=S',
      iconUrl: 'icon_s',
    },
    {
      id: 3,
      name: 'Gold',
      minScore: 10000,
      imageUrl: 'https://placehold.co/100/ffd700/white?text=G',
      iconUrl: 'icon_g',
    },
    {
      id: 4,
      name: 'Platinum',
      minScore: 30000,
      imageUrl: 'https://placehold.co/100/e5e4e2/white?text=P',
      iconUrl: 'icon_p',
    },
    {
      id: 5,
      name: 'Master',
      minScore: 50000,
      imageUrl: 'https://placehold.co/100/b9f2ff/white?text=M',
      iconUrl: 'icon_m',
    },
  ];

  for (const tier of tiers) {
    await prisma.tier.upsert({
      where: { id: tier.id },
      update: {},
      create: tier,
    });
  }
  console.log(`🌱 Tiers seeded: ${tiers.length}`);
}
