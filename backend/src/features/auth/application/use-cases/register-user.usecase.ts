import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/ports/i-user-repository';
import type { IPasswordService } from '../../domain/ports/i-password-service';
import type { ITokenService } from '../../domain/ports/i-token-service';
import { EmailAlreadyRegisteredError } from '../../domain/errors/auth.errors';
import {
  USER_REPOSITORY,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../../domain/ports/tokens';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,
    @Inject(TOKEN_SERVICE) private readonly tokenService: ITokenService,
  ) {}

  async execute(command: {
    email: string;
    displayName: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const existing = await this.userRepo.findByEmail(command.email);

    if (existing) {
      throw new EmailAlreadyRegisteredError(command.email);
    }

    const passwordHash = await this.passwordService.hash(command.password);

    const user = User.create({
      email: command.email,
      displayName: command.displayName,
      passwordHash,
    });

    const savedUser = await this.userRepo.create({
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
    });

    const token = await this.tokenService.generateToken({
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return { user: savedUser, token };
  }
}
