import { DynamicModule, Global, Module } from '@nestjs/common';
import { SurrealService } from './surreal.service';
import { SurrealConfig } from './surreal.config';

@Global()
@Module({})
export class SurrealModule {
  static forRoot(config: SurrealConfig): DynamicModule {
    return {
      global: true,
      module: SurrealModule,
      providers: [
        {
          provide: 'SURREAL_CONFIG',
          useValue: config,
        },
        SurrealService,
      ],
      exports: [SurrealService],
    };
  }
}
