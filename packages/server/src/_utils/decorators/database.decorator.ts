import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Database = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const clientId = request.headers['client-id'];
    const { database, table } = request.params;

    return {
      clientId,
      database,
      table,
    };
  },
);
