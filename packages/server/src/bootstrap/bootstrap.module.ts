import { Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { UsersModule } from '../users/users.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';

@Module({
  imports: [UsersModule, ApiKeysModule],
  providers: [BootstrapService],
})
export class BootstrapModule {}
