import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { IPasswordService } from '../domain/ports/i-password-service';

const SALT_ROUNDS = 10;

@Injectable()
export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return hash(password, SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
