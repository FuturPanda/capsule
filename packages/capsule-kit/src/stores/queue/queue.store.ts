// store/queueSlice.ts
import { OperationType, QueueOperation } from "@/stores/queue/queue.model.ts";
import { StateCreator } from "zustand/index";
import { v4 as uuidV4 } from "uuid";

export interface QueueSlice {
  operations: QueueOperation[];
  executedOperations: QueueOperation[];
  isProcessing: boolean;

  enqueue: <T extends OperationType>(
    operation: Omit<Extract<QueueOperation, { type: T }>, "id" | "timestamp">,
  ) => Promise<void>;
  processQueue: (operation: QueueOperation) => Promise<void>;
  clear: () => void;
}

export const createQueueSlice: StateCreator<
  QueueSlice,
  [],
  [["zustand/persist", unknown]]
> = (set) => ({
  operations: [],
  executedOperations: [],
  isProcessing: false,

  enqueue: async <T extends OperationType>(
    operation: Omit<Extract<QueueOperation, { type: T }>, "id" | "timestamp">,
  ) => {
    const newOperation: QueueOperation = {
      ...operation,
      id: uuidV4(),
      timestamp: Date.now(),
    } as QueueOperation;

    console.log("Enqueueing operation:", newOperation);
    set((state) => ({
      ...state,
      operations: [...state.operations, newOperation],
    }));
  },

  processQueue: async (operation: QueueOperation) => {
    switch (operation.type) {
      case OperationType.CONTENT_UPDATE: {
        const { contentId, updates, previousContent } = operation.data;
        console.log("Update in queue ", contentId, updates, previousContent);
        break;
      }
      case OperationType.CAPLET_CREATE: {
        const { caplet } = operation.data;
        console.log("Update in queue ", caplet);
        break;
      }
    }
  },

  clear: () =>
    set((state) => ({
      ...state,
      operations: [],
      executedOperations: [],
      isProcessing: false,
    })),
});
