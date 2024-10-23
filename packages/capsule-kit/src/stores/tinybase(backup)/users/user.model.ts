export interface GetUserDto {
  id: string;
  username: string | null;
  email: string;
}

export interface LoginResponseDto {
  access_token: string;
  refresh_token: string;
  user: GetUserDto;
}
