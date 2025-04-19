import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const clientId = req.headers['client-id'];
    if (!clientId) throw new UnauthorizedException('NO_CLIENT_ID');

    return !!clientId;
  }
}
