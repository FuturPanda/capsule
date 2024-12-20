// guards/api-key.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { createHash } from 'crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('x-api-key');
    const fingerprint = this.generateFingerprint(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // const isValid = this.authService.validateRequest(apiKey, fingerprint);
    /*if (!isValid) {
      throw new UnauthorizedException('Invalid API key or unauthorized usage');
    }*/

    return true;
  }

  private generateFingerprint(request: Request): string {
    const factors = [
      request.headers['user-agent'],
      request.headers['accept-language'],
      request.ip,
    ];

    return createHash('sha256').update(factors.join('|')).digest('hex');
  }
}
