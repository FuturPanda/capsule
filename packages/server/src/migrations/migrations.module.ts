import { Module } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { MigrationsController } from './migrations.controller';
import { DatabasesModule } from '../databases/databases.module';

@Module({
  imports: [DatabasesModule],
  controllers: [MigrationsController],
  providers: [MigrationsService],
})
export class MigrationsModule {}
