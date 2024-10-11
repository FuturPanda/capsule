import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../users/users.repository';
import { UserTypeEnum } from '../_utils/schemas/root.schema';

export enum TestEnum {
  ONE = 'ONE',
}

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(private readonly configService: ConfigService, private readonly usersRepository: UsersRepository) {}
  async onApplicationBootstrap(): Promise<any> {
    console.log('In bootstrap');
    console.log(this.configService.get('OWNER_EMAIL'));

    this.usersRepository.createUserIfNotExists(
      {
        email: this.configService.get('OWNER_EMAIL'),
        password: this.configService.get('OWNER_PASSWORD'),
        schema: '{}',
      },
      UserTypeEnum.OWNER,
    );

    //const owner: User = this.usersRepository.getOwner();
  }
}
