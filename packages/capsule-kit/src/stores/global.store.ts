import {
  createDatabaseSlice,
  DatabaseSlice,
} from "@/stores/databases/database.store.ts";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createUserSlice, UserSlice } from "./users/user.store";

export type BoundStore = UserSlice & DatabaseSlice;

export const useBoundStore = create<BoundStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createUserSlice(...a),
        ...createDatabaseSlice(...a),
      }),
      {
        name: "bound-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
