import { TableOptions } from "./schema.type";

export interface SnapshotType {
  version: string;
  name: string;
  id: string;
  prevId: string;
  entities: TableOptions[];
}
