import { ChiselDb, ChiselSchema } from '@capsule/chisel';
import { DynamicModule, Global, Inject, Module } from '@nestjs/common';
import { ClassType } from 'src/_utils/_types/generics';

export interface ChiselConfig {
  uri: string;
  dbName: string;
  schema?: ChiselSchema;
  generateTypes?: boolean;
  typesDir?: string;
}

@Module({})
export class ChiselModule {
  static forRootAsync(opts: ChiselConfig): DynamicModule {
    return {
      module: ChiselModule,
      imports: [ChiselCoreModule.forRootAsync(opts)],
    };
  }

  static forFeature<T>(...models: ClassType<T>[]): DynamicModule {
    const providers = createChiselProviders(...models);
    return {
      module: ChiselModule,
      providers: providers,
      exports: providers,
    };
  }
}

@Global()
@Module({})
export class ChiselCoreModule {
  static forRootAsync(opts: ChiselConfig): DynamicModule {
    const connectionProvider = {
      provide: 'DbConnectionToken',
      useFactory: (): ChiselDb => ChiselDb.provideConnection(opts),
    };
    return {
      module: ChiselCoreModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
    };
  }
}

export function createChiselProviders<T>(...args: ClassType<T>[]) {
  return (args || []).map((model) => ({
    provide: getModelToken(model.name),
    useFactory: (db: ChiselDb) => db.getModel(model),
    inject: ['DbConnectionToken'],
  }));
}

export function getModelToken(model: string) {
  return `${model}CapsuleModel`;
}

export const InjectModel = (model: string) => Inject(getModelToken(model));
