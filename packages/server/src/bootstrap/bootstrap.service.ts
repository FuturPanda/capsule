import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserTypeEnum } from '../_utils/schemas/root.schema';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { ChiselService } from '../chisel/chisel.service';
import { PermissionsRepository } from '../permissions/permissions.repository';
import { UsersRepository } from '../users/users.repository';

export enum TestEnum {
  ONE = 'ONE',
}

export const CLOUD_CAPSULE_PROVIDER_URL = 'http://localhost:5173'; //'https://www.caspule.sh';

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
    this.logger.debug(`In Application Bootstrap`);
    const ownerEmail = this.configService.get('OWNER_EMAIL');
    const password = this.configService.get('OWNER_PASSWORD');
    this.logger.log(ownerEmail, password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    this.usersRepository.createUserIfNotExists(
      {
        email: ownerEmail,
        password: hashedPassword,
      },
      UserTypeEnum.OWNER,
    );
    const apiKey = this.apiKeysService.createApiKeyIfNotExists();
    if (this.configService.get('IS_CLOUD_PROVIDED')) {
      fetch(`${CLOUD_CAPSULE_PROVIDER_URL}/api/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
        }),
      });
    }

    // await this.permissionRepository.createPermissions();
  }

  onApplicationShutdown(signal?: string): any {
    this.logger.debug(`In Application Shutdown : ${signal}`);
    this.chiselService.closeAllConnections();
  }
}
