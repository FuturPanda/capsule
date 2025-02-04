import { ChiselDb } from '@capsulesh/chisel';

export interface DatabaseConnection {
  dbname: string;
  connection: ChiselDb;
  lastAccessed: Date;
}
