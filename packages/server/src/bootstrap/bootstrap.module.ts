import { Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [BootstrapService],
})
export class BootstrapModule {}
