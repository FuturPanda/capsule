import { StateCreator } from "zustand";
import { OnboardingCaplets } from "@/stores/caplets/_utils/data/onboarding.data.ts";
import { ContentPoolSlice } from "@/stores/caplets/caplet-content.store.ts";
import { Caplet } from "@/stores/caplets/caplet.interface.ts";
import { capletRequest } from "@/stores/caplets/caplet.request.ts";

export interface CapletSlice {
  initializeCaplets: () => void;
  hasChanged: boolean;
  toggleHasChanged: () => void;
  caplets: Caplet[];
  findCaplet: (capletId: string) => Caplet | undefined;
  addCaplet: (caplet: Caplet) => void;
  updateCaplet: (id: string, updates: Partial<Caplet>) => void;
  removeCaplet: (id: string) => void;
  setCaplets: (caplets: Caplet[]) => void;
}

export const createCapletSlice: StateCreator<
  CapletSlice & ContentPoolSlice,
  [],
  [["zustand/persist", unknown]],
  CapletSlice
> = (set, get) => ({
  caplets: OnboardingCaplets,
  initializeCaplets: async () => {
    const fetchedCaplets = await capletRequest.getAllCaplets();
    if (fetchedCaplets)
      set({
        caplets: fetchedCaplets.map((c) => ({
          id: c.id,
          title: c.title,
          contentIds: [],
        })),
      });
  },

  hasChanged: true,
  toggleHasChanged: () => set((state) => ({ hasChanged: !state.hasChanged })),

  findCaplet: (capletId: string | number) => {
    const state = get();
    return state.caplets.find((cap) => cap.id == capletId); // TODO : properly cast ids
  },

  addCaplet: (caplet: Caplet) =>
    set((state) => ({
      ...state,
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
        ...state,
        caplets: state.caplets.map((c) =>
          c.id === capletId ? { ...c, contentIds: newContentIds } : c,
        ),
      };
    }),
});
