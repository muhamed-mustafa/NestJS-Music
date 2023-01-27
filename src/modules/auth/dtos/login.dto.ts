import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Must be an email' })
  readonly email: string;

  @IsString()
  readonly password: string;
}
