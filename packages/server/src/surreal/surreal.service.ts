import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PreparedQuery, RecordId, Surreal, Table } from 'surrealdb';
import { SurrealConfig } from './surreal.config';
// @ts-expect-error surrealDbError
import { surrealdbNodeEngines } from '@surrealdb/node';
import { ClassType } from '../_utils/_types/generics';

@Injectable()
export class SurrealService implements OnModuleInit, OnModuleDestroy {
  private readonly db: Surreal;
  private readonly logger = new Logger(SurrealService.name);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  constructor(@Inject('SURREAL_CONFIG') private config: SurrealConfig) {
    this.db = new Surreal({
      engines: surrealdbNodeEngines(),
    });
  }

  async onModuleInit() {
    try {
      await this.db.connect(this.config.path, {
        namespace: this.config.namespace,
        database: this.config.database,
      });
      this.logger.log('SurrealDB connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to SurrealDB:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.db.close();
  }

  create<T>(table: ClassType<T>, data?: { [P in keyof T]: T[P] }) {
    return this.db.create(table.name, data);
  }

  insert<T extends { [x: string]: any }>(
    table: ClassType<T>,
    data: { [P in keyof T]: T[P] },
  ): Promise<
    {
      [K in keyof (T['id'] extends RecordId<string>
        ? T
        : {
            id: RecordId<string>;
          } & T)]: (T['id'] extends RecordId<string>
        ? T
        : { id: RecordId<string> } & T)[K];
    }[]
  > {
    return this.db.insert<T>(table.name, data);
  }

  select<T>(table: ClassType<T>) {
    return this.db.select(table.name);
  }

  delete(from: Table | RecordId | string) {
    return this.db.delete(from);
  }

  query(query: PreparedQuery) {
    return this.db.query(query);
  }
}
