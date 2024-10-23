import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserTypeEnum } from '../_utils/schemas/root.schema';
import { UsersRepository } from '../users/users.repository';

export enum TestEnum {
  ONE = 'ONE',
}

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async onApplicationBootstrap(): Promise<any> {
    this.logger.debug('In bootstrap');
    this.logger.debug(this.configService.get('OWNER_EMAIL'));

    this.usersRepository.createUserIfNotExists(
      {
        email: this.configService.get('OWNER_EMAIL'),
        password: bcrypt.hashSync(this.configService.get('OWNER_PASSWORD'), 10),
        schema: '{}',
      },
      UserTypeEnum.OWNER,
    );
  }
}
