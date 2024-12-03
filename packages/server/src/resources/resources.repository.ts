import { InjectModel } from '../chisel/chisel.module';
import { Database } from '../models/root/database';
import { ChiselModel } from '@capsule/chisel';
import { Resource } from '../models/root/resource';
import { ResourceTypeEnum } from './resources.controller';

export class ResourcesRepository {
  constructor(
    @InjectModel(Database.name)
    private readonly databaseModel: ChiselModel<Database>,
    @InjectModel(Resource.name)
    private readonly resourceModel: ChiselModel<Resource>,
  ) {}

  createResource = (name: string) =>
    this.resourceModel.insert({ name: name, type: ResourceTypeEnum.DATABASE });

  createDatabase = (name: string, resourceId: string) =>
    this.databaseModel.insert({ name: name, resource_id: resourceId });
}
