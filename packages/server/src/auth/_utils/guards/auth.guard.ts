import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../../users/users.repository';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../_utils/config/env.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const clientId = req.headers['client-id'];
    if (!clientId) throw new UnauthorizedException('NO_CLIENT_ID');

    return !!clientId;
  }
}
