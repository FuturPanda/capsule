import { Module } from '@nestjs/common';
import { PersonModel } from 'src/_utils/models/root/person';
import { ChiselModule } from 'src/chisel/chisel.module';
import { PersonsController } from './persons.controller';
import { PersonsMapper } from './persons.mapper';
import { PersonsRepository } from './persons.repository';
import { PersonsService } from './persons.service';

@Module({
  imports: [ChiselModule.forFeature(PersonModel)],
  controllers: [PersonsController],
  providers: [PersonsService, PersonsRepository, PersonsMapper],
  exports: [PersonsService, PersonsRepository, PersonsMapper],
})
export class PersonsModule {}
