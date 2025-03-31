import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const ScopesAndClientIdentifier = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    console.log('HEADERS: ', req.headers);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return [];
    }
    console.log('HEADERS: ', authHeader);

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.decode(token);
      if (decoded && typeof decoded === 'object') {
        const payload = decoded as JwtPayloadWithScopes;
        return {
          clientIdentifier: payload.clientIdentifier.split('::')[0],
          scopes: payload.scopes.split(',') || [],
        };
      }
      return [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  },
);

interface JwtPayloadWithScopes {
  scopes?: string;
  clientIdentifier?: string;
}

export type ScopesAndClientIdentifierType = {
  clientIdentifier: string;
  scopes: string[];
};
