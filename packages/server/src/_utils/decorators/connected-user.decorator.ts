import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ConnectedUser = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
