import { User as PrismaUser, UserRole as PrsimaUserRole } from '@prisma/client';
import { User, UserRole } from '../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: prismaUser.email,
      displayName: prismaUser.displayName,
      passwordHash: prismaUser.passwordHash,
      role: prismaUser.role === PrsimaUserRole.FREE ? 'ADMIN' : 'USER',
      createdAt: prismaUser.createdAt,
    });
  }

  static toPrisma(user: User): Omit<PrismaUser, 'id' | 'createdAt'> {
    return {
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      role: user.role == 'ADMIN' ? 'PREMIUM' : 'FREE',
    };
  }
}
