import { Injectable } from '@nestjs/common';
import { InjectModel } from '../chisel/chisel.module';
import { ApiKey } from '../_utils/models/root/api_key';
import { ChiselModel } from '@capsulesh/chisel';
import { ApiKeyTypeEnum } from './_utils/enum/api-key-type.enum';

@Injectable()
export class ApiKeysRepository {
  constructor(
    @InjectModel(ApiKey.name) private readonly model: ChiselModel<ApiKey>,
  ) {}

  createApiKey = (apiKey: string, type: ApiKeyTypeEnum) =>
    this.model.insert(
      {
        value: apiKey,
        type: type,
      },
      { ignoreExisting: true },
    );

  getApiKeyByType = (type: ApiKeyTypeEnum) =>
    this.model
      .select({ value: 'api_key.value' })
      .where({ type: type })
      .exec({ one: true });
}
