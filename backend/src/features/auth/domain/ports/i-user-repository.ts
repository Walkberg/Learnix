import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    email: string;
    displayName: string;
    passwordHash: string;
  }): Promise<User>;
}
