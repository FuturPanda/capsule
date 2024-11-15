import { StateCreator } from "zustand";
import {
  Caplet,
  CapletContentTypeEnum,
} from "@/stores/caplets/caplet.model.ts";
import { v4 as uuidv4 } from "uuid";
import { OnboardingCaplets } from "@/stores/caplets/_utils/data/onboarding.data.ts";
import { ContentPoolSlice } from "@/stores/caplets/caplet-content.store.ts";

export interface CapletSlice {
  caplets: Caplet[];
  findCaplet: (capletId: string) => Caplet | undefined;
  addCaplet: (caplet: Caplet) => void;
  updateCaplet: (id: string, updates: Partial<Caplet>) => void;
  removeCaplet: (id: string) => void;
  setCaplets: (caplets: Caplet[]) => void;
  addContentToCaplet: (id: string, type: CapletContentTypeEnum) => void;
  removeContentFromCaplet: (capletId: string, contentId: string) => void;
}

export const createCapletSlice: StateCreator<
  CapletSlice & ContentPoolSlice,
  [],
  [["zustand/persist", unknown]],
  CapletSlice
> = (set, get) => ({
  caplets: OnboardingCaplets,

  findCaplet: (capletId: string) => {
    const state = get();
    return state.caplets.find((cap) => cap.id === capletId);
  },

  addCaplet: (caplet: Caplet) =>
    set((state) => ({
      ...state, // Preserve all other state
      caplets: [...state.caplets, caplet],
    })),

  updateCaplet: (id, updates) =>
    set((state) => ({
      ...state,
      caplets: state.caplets.map((caplet) =>
        caplet.id === id ? { ...caplet, ...updates } : caplet,
      ),
    })),

  removeCaplet: (id) =>
    set((state) => ({
      ...state,
      caplets: state.caplets.filter((caplet) => caplet.id !== id),
    })),

  setCaplets: (caplets) =>
    set((state) => ({
      ...state,
      caplets,
    })),

  addContentToCaplet: (id: string, type: CapletContentTypeEnum) =>
    set((state) => {
      const contentId = uuidv4();
      const caplet = state.caplets.find((c) => c.id === id);

      if (!caplet) return state;

      return {
        ...state,
        contentPool: {
          ...state.contentPool,
          [contentId]: {
            id: contentId,
            type: type,
            value: "",
          },
        },

        caplets: state.caplets.map((c) =>
          c.id === id ? { ...c, contentIds: [...c.contentIds, contentId] } : c,
        ),
      };
    }),
  removeContentFromCaplet: (capletId: string, contentId: string) =>
    set((state) => {
      return {
        ...state,
        caplets: state.caplets.map((c) =>
          c.id === capletId
            ? {
                ...c,
                contentIds: c.contentIds.filter((id) => id !== contentId),
              }
            : c,
        ),
      };
    }),

  reorderCapletContent: (
    capletId: string,
    sourceIndex: number,
    targetIndex: number,
  ) =>
    set((state) => {
      const caplet = state.caplets.find((c) => c.id === capletId);
      if (!caplet) return state;

      const newContentIds = [...caplet.contentIds];
      const [removed] = newContentIds.splice(sourceIndex, 1);
      newContentIds.splice(targetIndex, 0, removed);

      return {
        ...state, // Preserve all other state
        caplets: state.caplets.map((c) =>
          c.id === capletId ? { ...c, contentIds: newContentIds } : c,
        ),
      };
    }),
});
