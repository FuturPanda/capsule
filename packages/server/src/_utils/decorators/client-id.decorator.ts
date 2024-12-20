import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientId = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.headers['client-id'];
});
