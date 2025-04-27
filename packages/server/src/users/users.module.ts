import { forwardRef, Module } from '@nestjs/common';
import { ChiselModule } from '../chisel/chisel.module';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationsService } from '../authorizations/authorizations.service';
import { UserModel } from '../_utils/models/root/user';
@Module({
  imports: [ChiselModule.forFeature(UserModel), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersMapper,
    AuthorizationsService,
  ],
  exports: [UsersService, UsersRepository, UsersMapper],
})
export class UsersModule {}
