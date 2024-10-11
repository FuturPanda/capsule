import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  mail: string;

  @IsString()
  password: string;
}
