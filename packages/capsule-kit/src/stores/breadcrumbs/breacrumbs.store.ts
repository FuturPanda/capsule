import { StateCreator } from "zustand/index";

export interface BreadcrumbsSlice {
  breadcrumbsPath: string[];
  setBreadcrumbsPath: (newPath: string[]) => void;
}

export const createBreadcrumbsSlice: StateCreator<
  BreadcrumbsSlice,
  [],
  [["zustand/persist", unknown]]
> = (set) => ({
  breadcrumbsPath: [],
  setBreadcrumbsPath: (newPath: string[]) =>
    set((state) => ({
      ...state,
      breadcrumbsPath: newPath,
    })),
});
