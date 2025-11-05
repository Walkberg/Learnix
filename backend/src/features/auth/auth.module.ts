import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { RegisterUserUseCase } from './application/use-cases/register-user.usecase';
import { LoginUserUseCase } from './application/use-cases/login-user.usecase';
import { PrismaService } from '../../common/prisma.service';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { BcryptPasswordService } from './infrastructure/bcrypt-password.service';
import { JwtTokenService } from './infrastructure/jwt-token.service';
import {
  USER_REPOSITORY,
  TOKEN_SERVICE,
  PASSWORD_SERVICE,
} from './domain/ports/tokens';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    // Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,

    // Infrastructure Services
    PrismaService,
    JwtStrategy,

    // Domain Services & Repositories
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PASSWORD_SERVICE, useClass: BcryptPasswordService },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
  ],
  controllers: [AuthController],
  exports: [
    RegisterUserUseCase,
    LoginUserUseCase,
    USER_REPOSITORY,
    TOKEN_SERVICE,
    PASSWORD_SERVICE,
  ],
})
export class AuthModule {}
