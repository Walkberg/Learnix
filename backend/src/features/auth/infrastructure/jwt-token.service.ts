import { sign } from 'jsonwebtoken';
import { ITokenService } from '../domain/ports/i-token-service';

export class JwtTokenService implements ITokenService {
  constructor(private secret: string) {
    this.secret = process.env.JWT_SECRET || 'yeee';
  }

  async generateToken(payload: {
    userId: string;
    email: string;
    role: string;
  }): Promise<string> {
    return sign(
      {
        sub: payload.userId,
        email: payload.email,
        role: payload.role,
      },
      this.secret,
      { expiresIn: '7d' },
    );
  }
}
