import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { DatabasesRepository } from './databases.repository';

@Module({
  imports: [],
  controllers: [DatabasesController],
  providers: [DatabasesService, DatabasesRepository],
})
export class DatabasesModule {}
