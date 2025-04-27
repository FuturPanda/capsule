import { Module } from '@nestjs/common';
import { ChiselModule } from '../chisel/chisel.module';
import { AuthorizationsService } from './authorizations.service';
import { AuthorizationsRepository } from './authorizations.repository';
import {
  AuthorizationModel,
  ResourceClientAuthorizationModel,
} from '../_utils/models/root/authorization';

@Module({
  imports: [
    ChiselModule.forFeature(
      AuthorizationModel,
      ResourceClientAuthorizationModel,
    ),
  ],
  providers: [AuthorizationsService, AuthorizationsRepository],
  exports: [AuthorizationsService, AuthorizationsRepository],
})
export class AuthorizationsModule {}
