import { Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { UsersModule } from '../users/users.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [UsersModule, ApiKeysModule, PermissionsModule],
  providers: [BootstrapService],
})
export class BootstrapModule {}
