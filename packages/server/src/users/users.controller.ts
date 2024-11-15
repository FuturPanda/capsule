import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './_utils/dto/request/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    console.log('in usecontroller ', loginUserDto);
    return this.usersService.loginUser(loginUserDto);
  }

  @Post('/refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.usersService.validateUserConnection(body.refreshToken);
  }
}
