import { ChiselDb, ChiselSchema } from '@capsule/chisel';
import { Injectable } from '@nestjs/common';
import { ChiselConfig } from './chisel.module';

@Injectable()
export class ChiselService {
  constructor(private readonly chiselDatabase: ChiselDb) {}

  public createDatabase(schema: ChiselSchema) {
    /* return ChiselDb.SchemaFactory({
    uri: string;
    dbName: string;
    schema: ChiselSchema;
    generateTypes: boolean;
    typesDir: string}).fromSchema(schema);*/
  }

  public async getChiselDB(options: ChiselConfig) {
    try {
    } catch (error) {
      throw new Error(`Failed to create database: ${error.message}`);
    }
  }
}
