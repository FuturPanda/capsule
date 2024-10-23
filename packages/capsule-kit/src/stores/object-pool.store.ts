import { action, observable } from "mobx";
export type ObjectInPool = Root | Definition | CapsulePipe | Workspace;

export class ObjectPoolStore {
  @observable accessor value: ObjectInPool[] = [];

  constructor(objects: ObjectInPool[]) {
    this.value = objects;
  }

  @action
  getWorkspaceById(id: string): Workspace {
    return this.value.find((obj) => obj.id === id) as Workspace;
  }

  @action
  addToPool(obj: ObjectInPool) {
    console.log("in add to pool ", obj);
    this.value = [...this.value, obj];
  }

  @action
  initPool() {
    console.log("Initializing pool");
    const root: Root = { id: "root", workspaces: [] };
    console.log("root", root);
    const workspace1: Workspace = {
      id: "w1",
      name: "MyFirstWorkspace",
      pipes: [],
    };
    const pipe1: CapsulePipe = {
      id: "p1",
      name: "MyFirstPipe",
      workspace: workspace1.id,
      children: [],
    };
    const definition1: Definition = {
      id: "d1",
      name: "workspace",
      pipe: pipe1.id,
      children: [],
    };
    console.log();
    root.workspaces.push(workspace1.id);
    workspace1.pipes.push(pipe1.id);
    pipe1.children.push(definition1.id);
    this.value = [root, workspace1, pipe1, definition1];
    console.log("Pool initialized", this.value);
  }
}

class Root {
  id: string;
  workspaces: string[] = [];
  constructor(id: string) {
    this.id = id;
  }
}

class Workspace {
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
  id: string;
  name: string;
  pipes: string[] = [];
}

class CapsulePipe {
  constructor(
    id: string,
    name: string,
    workspace: string,
    workspaceId?: string,
  ) {
    this.id = id;
    this.name = name;
    this.workspace = workspace.id;
    console.log(workspaceId);
  }
  id: string;
  name: string;
  workspace: string;
  children: string[] = [];
}

class Definition {
  constructor(id: string, name: string, pipe: CapsulePipe, pipeId?: string) {
    this.id = id;
    this.name = name;
    this.pipe = pipe.id;
    console.log(pipeId);
  }
  id: string;
  name: string;
  pipe: string;
  children: string[] = [];
}

function test() {
  if (true) {
    console.log("hello");
  } else {
    console.log("noway");
  }
}
