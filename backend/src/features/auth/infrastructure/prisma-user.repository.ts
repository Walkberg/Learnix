import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { IUserRepository } from '../domain/ports/i-user-repository';
import { User } from '../domain/entities/user.entity';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return UserMapper.toDomain(user);
  }

  async create(data: {
    email: string;
    displayName: string;
    passwordHash: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        role: 'FREE',
      },
    });

    return UserMapper.toDomain(user);
  }
}
