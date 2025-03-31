import { Module } from '@nestjs/common';
import { ReactivityService } from './reactivity.service';
import { ReactivityController } from './reactivity.controller';

@Module({
  controllers: [ReactivityController],
  providers: [ReactivityService],
})
export class ReactivityModule {}
