import { IsEmail, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  username?: string;

  @IsString()
  description?: string;

  @IsUrl()
  avatarUrl?: string;
}
