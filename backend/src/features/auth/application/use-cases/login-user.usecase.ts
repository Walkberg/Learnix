import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/ports/i-user-repository';
import type { IPasswordService } from '../../domain/ports/i-password-service';
import type { ITokenService } from '../../domain/ports/i-token-service';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';
import {
  USER_REPOSITORY,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../../domain/ports/tokens';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: IUserRepository,
    @Inject(PASSWORD_SERVICE) private passwordService: IPasswordService,
    @Inject(TOKEN_SERVICE) private tokenService: ITokenService,
  ) {}

  async execute(command: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const user = await this.userRepo.findByEmail(command.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await this.passwordService.compare(
      command.password,
      user.passwordHash,
    );

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const token = await this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}
