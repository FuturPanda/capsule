import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { DatabaseModel } from '../_utils/models/root/database';
import { InjectModel } from '../chisel/chisel.module';
import {
  ResourceModel,
  ResourceTypeEnum,
} from '../_utils/models/root/resource';

@Injectable()
export class ResourcesRepository {
  constructor(
    @InjectModel(ResourceModel.name)
    private readonly resourceModel: ChiselModel<ResourceModel>,
  ) {}

  createResource = (name: string, type: ResourceTypeEnum) => {
    return this.resourceModel.insert(
      { name: name, type: type },
      { ignoreExisting: true },
    );
  };
}
