import { Module } from '@nestjs/common';
import { DynamicQueriesService } from './dynamic-queries.service';
import { DynamicQueriesController } from './dynamic-queries.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DynamicQueriesController],
  providers: [DynamicQueriesService],
})
export class DynamicQueriesModule {}
