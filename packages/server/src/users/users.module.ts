import { Module } from '@nestjs/common';
import { User } from 'src/models/root/user';
import { ChiselModule } from '../chisel/chisel.module';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [ChiselModule.forFeature(User)],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersMapper],
  exports: [UsersService, UsersRepository, UsersMapper],
})
export class UsersModule {}
