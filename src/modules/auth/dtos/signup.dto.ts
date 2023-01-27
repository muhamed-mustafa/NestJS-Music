import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Must be an email' })
  readonly email: string;

  @IsString()
  readonly username: string;

  @IsString()
  @MinLength(8, { message: 'Password must have length of at least 8' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 number and 1 letter',
  })
  readonly password: string;
}
