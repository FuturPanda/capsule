import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionsService } from 'src/permissions/permissions.service';
import { User } from '../_utils/models/root/user';
import { ChiselModule } from '../chisel/chisel.module';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [ChiselModule.forFeature(User), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersMapper, PermissionsService],
  exports: [UsersService, UsersRepository, UsersMapper],
})
export class UsersModule {}
