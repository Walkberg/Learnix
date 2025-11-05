import { UserRole } from '@prisma/client';

export class User {
  id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const USER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;
