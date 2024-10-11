import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './_utils/dto/request/create-user.dto';
import { LoginUserDto } from './_utils/dto/request/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  createUser(@Body() createUserDto: CreateUserDto) {
    // return this.usersService.createUser(createUserDto);
  }

  @Post('/login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    //return this.usersService.loginUser(loginUserDto);
  }

  @Get('profile')
  getProfile() {
    return 'user';
  }
}
