import { IsEmail, IsString, MinLength } from 'class-validator';
import { USER_EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '../domain/user.entity';

export class RegisterDto {
  @IsString()
  displayName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH, {
    message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  })
  password: string;
}
