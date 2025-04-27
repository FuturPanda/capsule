import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { BootstrapService } from './bootstrap.service';
import { DatabasesModule } from '../databases/databases.module';
import { ResourceModel } from '../_utils/models/root/resource';
import { ResourcesModule } from '../resources/resources.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [UsersModule, DatabasesModule, ResourcesModule, RolesModule],
  providers: [BootstrapService],
})
export class BootstrapModule {}
