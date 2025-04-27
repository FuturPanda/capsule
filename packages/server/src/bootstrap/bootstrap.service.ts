import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ChiselService } from '../chisel/chisel.service';
import { UsersRepository } from '../users/users.repository';
import { DatabasesRepository } from '../databases/databases.repository';
import { ResourcesRepository } from '../resources/resources.repository';
import { ResourceTypeEnum } from '../_utils/models/root/resource';
import { RolesRepository } from '../roles/roles.repository';
import { PERMISSIONS_ENUM } from '../roles/utils/permissions.enum';

@Injectable()
export class BootstrapService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(BootstrapService.name);
  private readonly DATABASE_NAME = 'root';

  private readonly OWNER_ROLE = 'owner';

  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly chiselService: ChiselService,
    private readonly databaseRepository: DatabasesRepository,
    private readonly resourcesRepository: ResourcesRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async onApplicationBootstrap(): Promise<any> {
    this.logger.debug(`In Application Bootstrap`);
    const ownerEmail = this.configService.get('OWNER_EMAIL');
    const password = this.configService.get('OWNER_PASSWORD');
    this.logger.log(ownerEmail, password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = this.usersRepository.findUserWithRolesById(ownerEmail);
    let newUser;
    if (!user) {
      newUser = this.usersRepository.createUserIfNotExists({
        email: ownerEmail,
        password: hashedPassword,
      });
    }
    if (!user && !newUser) {
      throw new Error('User not found');
    }

    const rootDb = this.databaseRepository.findDatabaseByName('root');
    if (!rootDb) {
      const resource = this.resourcesRepository.createResource(
        this.DATABASE_NAME,
        ResourceTypeEnum.DATABASE,
      );
      if (resource.id)
        this.databaseRepository.createDatabase(resource.id, 'root');
    }

    const ownerRole = this.rolesRepository.createRole(this.OWNER_ROLE);
    const ownerPermission = this.rolesRepository.createPermission(
      PERMISSIONS_ENUM.OWNER,
    );
    if (ownerRole.id && ownerPermission.id) {
      this.rolesRepository.addPermissionToRole(
        ownerRole.id as number,
        ownerPermission.id as number,
      );
      this.rolesRepository.giveRoleToUser(
        (user ? user.id : newUser.id) as number,
        ownerRole.id as number,
      );
    }
  }

  onApplicationShutdown(signal?: string): any {
    this.logger.debug(`In Application Shutdown : ${signal}`);
    this.chiselService.closeAllConnections();
  }
}
