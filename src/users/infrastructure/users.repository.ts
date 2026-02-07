import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { IUsersRepository } from '../domain/users.repository.interface';
import { User } from '../domain/users.entity';

@Injectable()
export class UsersRepositoryImpl implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllOrderByScoreDesc(page: number, size: number, tierId?: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: tierId ? { tierId } : {},
      skip: (page - 1) * size,
      take: size,
      orderBy: { totalScore: 'desc' },
      include: { tier: true },
    });

    return users.map((user) => User.from(user));
  }

  async countAll(tierId?: number): Promise<number> {
    return this.prisma.user.count({ where: tierId ? { tierId } : {} });
  }
}
