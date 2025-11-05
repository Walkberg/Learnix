export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  create(data: {
    email: string;
    displayName: string;
    passwordHash: string;
  }): Promise<any>;
}
