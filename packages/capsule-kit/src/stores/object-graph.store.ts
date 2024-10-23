import { observable, reaction } from "mobx";
import { ObjectPoolStore } from "./object-pool.store";

export interface GraphNode {
  id: string;
  type: string;
  name: string;
  children: GraphNode[];
}

export class ObjectGraphStore {
  @observable accessor root: GraphNode | null = null;
  @observable private accessor objectPool: ObjectPoolStore;

  constructor(objectPool: ObjectPoolStore) {
    this.objectPool = objectPool;
    reaction(
      () => this.objectPool.value.slice(),
      () => this.rebuildGraph(),
      { fireImmediately: true },
    );
  }

  rebuildGraph() {
    const rootObject = this.objectPool.value.find((obj) => obj.id === "root");
    if (!rootObject) {
      this.root = null;
      return;
    }

    this.root = this.buildGraphNode(rootObject);
  }

  private buildGraphNode(obj: any): GraphNode {
    const node: GraphNode = {
      id: obj.id,
      type: this.getObjectType(obj),
      name: obj.name || obj.id,
      children: [],
    };

    if ("workspaces" in obj) {
      node.children = obj.workspaces.map((workspaceId: string) =>
        this.buildGraphNode(
          this.objectPool.value.find((o) => o.id === workspaceId),
        ),
      );
    } else if ("pipes" in obj) {
      node.children = obj.pipes.map((pipeId: string) =>
        this.buildGraphNode(this.objectPool.value.find((o) => o.id === pipeId)),
      );
    } else if ("children" in obj) {
      node.children = obj.children.map((childId: string) =>
        this.buildGraphNode(
          this.objectPool.value.find((o) => o.id === childId),
        ),
      );
    }

    return node;
  }

  private getObjectType(obj: any): string {
    if ("workspaces" in obj) return "root";
    if ("pipes" in obj) return "workspace";
    if ("workspace" in obj) return "pipe";
    if ("pipe" in obj) return "definition";
    return "unknown";
  }
}
