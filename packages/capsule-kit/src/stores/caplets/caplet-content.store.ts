import { StateCreator } from "zustand";
import {
  CapletContent,
  CapletContentTypeEnum,
} from "@/stores/caplets/caplet.model.ts";
import { v4 as uuidv4 } from "uuid";
import { OnboardingContentPool } from "@/stores/caplets/_utils/data/onboarding.data.ts";
import { CapletSlice } from "@/stores/caplets/caplet.store.ts";

export interface ContentPoolSlice {
  contentPool: Record<string, CapletContent>;
  findContent: (contentId: string) => CapletContent | undefined;
  updateContent: (contentId: string, updates: Partial<CapletContent>) => void;
  createContent: (
    type: CapletContentTypeEnum,
    initialData?: Partial<CapletContent>,
  ) => string;
  removeContent: (contentId: string) => void;
  bulkRemoveContent: (contentIds: string[]) => void;
}

export const createContentPoolSlice: StateCreator<
  ContentPoolSlice & CapletSlice,
  [],
  [["zustand/persist", unknown]],
  ContentPoolSlice
> = (set, get) => ({
  contentPool: OnboardingContentPool,

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

  createContent: (type: CapletContentTypeEnum, initialData = {}) => {
    const contentId = uuidv4();
    set((state) => ({
      contentPool: {
        ...state.contentPool,
        [contentId]: {
          id: contentId,
          type,
          value: "",
          ...initialData,
        },
      },
    }));
    return contentId;
  },

  removeContent: (contentId: string) =>
    set((state) => {
      const newPool = { ...state.contentPool };
      delete newPool[contentId];
      return { contentPool: newPool };
    }),

  bulkRemoveContent: (contentIds: string[]) =>
    set((state) => {
      const newPool = { ...state.contentPool };
      contentIds.forEach((id) => delete newPool[id]);
      return { contentPool: newPool };
    }),
});
