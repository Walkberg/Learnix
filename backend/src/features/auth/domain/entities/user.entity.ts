import { randomUUID } from 'crypto';

export type UserRole = 'USER' | 'ADMIN';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly displayName: string,
    public readonly passwordHash: string,
    public readonly role: UserRole = 'USER',
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(data: {
    id?: string;
    email: string;
    displayName: string;
    passwordHash: string;
    role?: UserRole;
    createdAt?: Date;
  }): User {
    return new User(
      data.id || randomUUID(),
      data.email,
      data.displayName,
      data.passwordHash,
      data.role || 'USER',
      data.createdAt || new Date(),
    );
  }
}
