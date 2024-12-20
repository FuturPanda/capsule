import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

export function Protect() {
  return applyDecorators(
    ApiBearerAuth('client-id'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UseGuards(AuthGuard),
  );
}
