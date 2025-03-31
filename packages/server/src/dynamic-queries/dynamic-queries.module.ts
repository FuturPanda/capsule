import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
import { UsersModule } from '../users/users.module';
import { DynamicQueriesController } from './dynamic-queries.controller';
import { DynamicQueriesService } from './dynamic-queries.service';

@Module({
  imports: [UsersModule, DatabasesModule],
  controllers: [DynamicQueriesController],
  providers: [DynamicQueriesService],
})
export class DynamicQueriesModule {}
