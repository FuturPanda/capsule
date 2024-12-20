import { ChiselDb, IFactoryOpts } from '@capsule/chisel';
import { DynamicModule, Global, Inject, Module } from '@nestjs/common';
import { ClassType } from 'src/_utils/_types/generics';
import { ChiselService } from './chisel.service';

export const CHISEL_DB_CONNECTION = 'DbConnectionToken';

export function getModelToken(model: string) {
  return `${model}CapsuleModel`;
}

export const InjectModel = (model: string) => Inject(getModelToken(model));

export function createChiselProviders<T>(...args: ClassType<T>[]) {
  return (args || []).map((model) => ({
    provide: getModelToken(model.name),
    useFactory: (db: ChiselDb) => db.getModel(model),
    inject: [CHISEL_DB_CONNECTION],
  }));
}

@Global()
@Module({})
export class ChiselCoreModule {
  static forRootAsync(opts: IFactoryOpts): DynamicModule {
    const connectionProvider = {
      provide: CHISEL_DB_CONNECTION,
      useFactory: (): ChiselDb => ChiselDb.create(opts),
    };

    return {
      module: ChiselCoreModule,
      providers: [connectionProvider, ChiselService],
      exports: [connectionProvider, ChiselService],
      global: true,
    };
  }
}

@Module({})
export class ChiselModule {
  static forRootAsync(opts: IFactoryOpts): DynamicModule {
    return {
      module: ChiselModule,
      imports: [ChiselCoreModule.forRootAsync(opts)],
      exports: [ChiselCoreModule],
    };
  }

  static forFeature(...models: ClassType<any>[]): DynamicModule {
    const providers = createChiselProviders(...models);
    return {
      module: ChiselModule,
      providers: providers,
      exports: providers,
    };
  }
}
