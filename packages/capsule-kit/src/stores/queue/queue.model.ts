import { Caplet, CapletContent } from "@/stores/caplets/caplet.model.ts";

export enum OperationType {
  CAPLET_CREATE = "CAPLET_CREATE",

  CONTENT_UPDATE = "CONTENT_UPDATE",
  CAPLET_CONTENT_ADD = "CAPLET_CONTENT_ADD",
  CAPLET_CONTENT_REMOVE = "CAPLET_CONTENT_REMOVE",
  CAPLET_CONTENT_REORDER = "CAPLET_CONTENT_REORDER",
}

export interface BaseQueueOperation {
  id: string;
  timestamp: number;
  type: OperationType;
}

interface ContentUpdateOperation extends BaseQueueOperation {
  type: OperationType.CONTENT_UPDATE;
  data: {
    contentId: string;
    updates: Partial<CapletContent>;
    previousContent: CapletContent;
  };
}

interface CapletCreateOperation extends BaseQueueOperation {
  type: OperationType.CAPLET_CREATE;
  data: {
    caplet: Caplet;
  };
}

interface CapletContentAddOperation extends BaseQueueOperation {
  type: OperationType.CAPLET_CONTENT_ADD;
  data: {
    content: CapletContent;
  };
}

interface CapletContentRemoveOperation extends BaseQueueOperation {
  type: OperationType.CAPLET_CONTENT_REMOVE;
  data: {
    capletId: string;
    contentId: string;
  };
}

interface CapletContentReorderOperation extends BaseQueueOperation {
  type: OperationType.CAPLET_CONTENT_REORDER;
  data: {
    capletId: string;
    newOrder: string[];
    previousOrder: string[];
  };
}

export type QueueOperation =
  | ContentUpdateOperation
  | CapletCreateOperation
  | CapletContentAddOperation
  | CapletContentRemoveOperation
  | CapletContentReorderOperation;
