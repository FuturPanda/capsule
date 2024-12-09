import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysRepository } from './api-keys.repository';
import { ChiselModule } from '../chisel/chisel.module';
import { ApiKey } from '../_utils/models/root/api_key';

@Module({
  imports: [ChiselModule.forFeature(ApiKey)],
  controllers: [ApiKeysController],
  providers: [ApiKeysService, ApiKeysRepository],
  exports: [ApiKeysService, ApiKeysRepository],
})
export class ApiKeysModule {}
