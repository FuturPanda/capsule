import { ChiselDb } from '@capsule/chisel';

export interface DatabaseConnection {
  dbname: string;
  connection: ChiselDb;
  lastAccessed: Date;
}
