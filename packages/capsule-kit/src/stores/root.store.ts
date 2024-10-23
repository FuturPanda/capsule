import { ObjectGraphStore } from "./object-graph.store";
import { ObjectPoolStore } from "./object-pool.store";

export class RootStore {
  objectGraph: ObjectGraphStore;
  objectPool: ObjectPoolStore;

  constructor() {
    this.objectPool = new ObjectPoolStore([]);
    this.objectGraph = new ObjectGraphStore(this.objectPool);
  }
}
