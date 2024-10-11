import { ChiselDb, ChiselSchema } from '@capsule/chisel';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabasesRepository {
  private readonly rootDatabase = new ChiselDb('./databases/root/root.capsule');

  createDatabase(schema: ChiselSchema) {
    //this.rootDatabase.insertInto(Database).values({ name: schema.dbName, schema: JSON.stringify(schema) });
  }
}
