import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserTypeEnum } from '../_utils/schemas/root.schema';
import { UsersRepository } from '../users/users.repository';
import { ChiselService } from '../chisel/chisel.service';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { PermissionsRepository } from '../permissions/permissions.repository';

export enum TestEnum {
  ONE = 'ONE',
}

@Injectable()
export class BootstrapService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly chiselService: ChiselService,
    private readonly apiKeysService: ApiKeysService,
    private readonly permissionRepository: PermissionsRepository,
  ) {}

  async onApplicationBootstrap(): Promise<any> {
    const ownerEmail = this.configService.get('OWNER_EMAIL');
    const password = this.configService.get('OWNER_PASSWORD');
    const hashedPassword = bcrypt.hashSync(password, 10);
    this.usersRepository.createUserIfNotExists(
      {
        email: ownerEmail,
        password: hashedPassword,
      },
      UserTypeEnum.OWNER,
    );
    const apiKey = this.apiKeysService.createApiKeyIfNotExists(
      ownerEmail,
      password,
    );

    // await this.permissionRepository.createPermissions();
  }

  onApplicationShutdown(signal?: string): any {
    this.logger.debug(`In Application Shutdown : ${signal}`);
    this.chiselService.closeAllConnections();
  }
}
