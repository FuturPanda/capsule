import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './_utils/dto/request/login-user.dto';
import { UpdateProfileDto } from './_utils/dto/request/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
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

  @Get('owner')
  getOwnerPublicProfile() {
    return this.usersService.getOwnerPublicProfile();
  }

  @Put('owner')
  updateOwnerProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateOwnerProfile(updateProfileDto);
  }
}
