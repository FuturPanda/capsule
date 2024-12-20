import { StateCreator } from "zustand";

import { v4 as uuidv4 } from "uuid";
import {
  ContentPool,
  OnboardingContentPool,
} from "@/stores/caplets/_utils/data/onboarding.data.ts";
import { CapletSlice } from "@/stores/caplets/caplet.store.ts";
import { QueueSlice } from "@/stores/queue/queue.store.ts";
import { OperationType } from "@/stores/queue/queue.model.ts";
import {
  CapletContent,
  CapletContentTypeEnum,
} from "@/stores/caplets/caplet.interface.ts";
import { capletRequest } from "@/stores/caplets/caplet.request.ts";

export interface ContentPoolSlice {
  contentPool: Record<string, CapletContent>;
  initializeContentPool: () => void;
  findContent: (contentId: string) => CapletContent | undefined;
  updateContent: (contentId: string, updates: Partial<CapletContent>) => void;
  createContent: (id: string, type: CapletContentTypeEnum) => Promise<string>;
  deleteContent: (contentId: string) => void;
  bulkRemoveContent: (contentIds: string[]) => void;
  addContentToCaplet: (capletId: string, contentId: string) => void;
  removeContentFromCaplet: (
    capletId: string,
    contentId: string,
  ) => Promise<void>;
}

export const createContentPoolSlice: StateCreator<
  ContentPoolSlice & CapletSlice & QueueSlice,
  [],
  [["zustand/persist", unknown]],
  ContentPoolSlice
> = (set, get) => ({
  contentPool: OnboardingContentPool,

  initializeContentPool: async () => {
    const contents = await capletRequest.getContentPool();
    const contentPool: ContentPool = {};
    const state = get();
    if (contents)
      contents.forEach((c) => {
        contentPool[c.id] = { ...c };
        state.addContentToCaplet(c.caplet_id, c.id);
      });
    set({ contentPool });
  },

  findContent: (contentId: string) => {
    return get().contentPool[contentId];
  },

  updateContent: (contentId: string, updates: Partial<CapletContent>) =>
    set((state) => ({
      ...state,
      contentPool: {
        ...state.contentPool,
        [contentId]: {
          ...state.contentPool[contentId],
          ...updates,
        },
      },
    })),

  createContent: async (id: string, type: CapletContentTypeEnum) => {
    const contentId = uuidv4();
    const newContent = {
      id: contentId,
      content_type: type,
      value: "",
    };
    await capletRequest.createContent([
      {
        id: contentId,
        caplet_id: id,
        content_type: type,
        value: "",
      },
    ]);
    set((state) => {
      const caplet = state.caplets.find((c) => c.id === id);

      if (!caplet) return state;

      return {
        contentPool: {
          ...state.contentPool,
          [contentId]: newContent,
        },
        caplets: state.caplets.map((c) =>
          c.id === id ? { ...c, contentIds: [...c.contentIds, contentId] } : c,
        ),
      };
    });

    await get().enqueue({
      type: OperationType.CAPLET_CONTENT_ADD,
      data: {
        content: newContent,
      },
    });
    return contentId;
  },

  deleteContent: (contentId: string) =>
    set((state) => {
      const newPool = { ...state.contentPool };
      delete newPool[contentId];
      return { contentPool: newPool };
    }),

  addContentToCaplet: async (capletId: string, contentId: string) => {
    set((state) => ({
      ...state,
      caplets: state.caplets.map((c) =>
        c.id === capletId
          ? {
              ...c,
              contentIds: [...c.contentIds, contentId],
            }
          : c,
      ),
    }));
  },

  removeContentFromCaplet: async (capletId: string, contentId: string) => {
    set((state) => ({
      ...state,
      caplets: state.caplets.map((c) =>
        c.id === capletId
          ? {
              ...c,
              contentIds: c.contentIds.filter((id) => id !== contentId),
            }
          : c,
      ),
    }));

    await get().enqueue({
      type: OperationType.CAPLET_CONTENT_REMOVE,
      data: {
        capletId: capletId,
        contentId: contentId,
      },
    });
  },

  bulkRemoveContent: (contentIds: string[]) =>
    set((state) => {
      const newPool = { ...state.contentPool };
      contentIds.forEach((id) => delete newPool[id]);
      return { contentPool: newPool };
    }),
});
