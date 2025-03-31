import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UsersModule } from '../users/users.module';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [UsersModule, ApiKeysModule, PermissionsModule, DatabasesModule],
  providers: [BootstrapService],
})
export class BootstrapModule {}
