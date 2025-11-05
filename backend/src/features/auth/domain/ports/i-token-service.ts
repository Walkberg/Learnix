export interface ITokenService {
  generateToken(payload: {
    userId: string;
    email: string;
    role: string;
  }): Promise<string>;
}
