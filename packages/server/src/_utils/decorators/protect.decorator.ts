import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/_utils/guards/auth.guard';

export const Protect = () =>
  applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard));
