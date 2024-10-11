import { ChiselDb } from '../../src';

let database: ChiselDb;
let schema = {};

beforeEach(() => {
  database = ChiselDb.SchemaFactory({ schema: schema }).fromSchemaSync();
});

describe('execute queries on model', () => {
  test('insert into', () => {});
  test('select from', () => {});
  test('update', () => {});
  test('delete', () => {});
});
