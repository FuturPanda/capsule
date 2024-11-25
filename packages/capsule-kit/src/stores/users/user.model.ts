export interface LoginDto {
  access_token: string;
  refresh_token: string;
  user: GetUserDto;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
}

export interface GetUserDto {
  id: string;
  username: string;
  avatar: string;
  email: string;
  bio: string;
}

export interface RefreshDto {
  access_token: string;
}
