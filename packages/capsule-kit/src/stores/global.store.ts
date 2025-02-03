import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createUserSlice, UserSlice } from "./users/user.store";
import {
  CapletSlice,
  createCapletSlice,
} from "@/stores/caplets/caplet.store.ts";
import {
  ContentPoolSlice,
  createContentPoolSlice,
} from "@/stores/caplets/caplet-content.store.ts";
import {
  createNetworkSlice,
  NetworkSlice,
} from "@/stores/network/network.store.ts";
import { createQueueSlice, QueueSlice } from "@/stores/queue/queue.store.ts";
import {
  createDatabaseSlice,
  DatabaseSlice,
} from "@/stores/databases/database.store.ts";
import {
  BreadcrumbsSlice,
  createBreadcrumbsSlice,
} from "@/stores/breadcrumbs/breacrumbs.store.ts";

export type BoundStore = UserSlice &
  CapletSlice &
  ContentPoolSlice &
  DatabaseSlice &
  NetworkSlice &
  BreadcrumbsSlice &
  QueueSlice;

export const useBoundStore = create<BoundStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createUserSlice(...a),
        ...createBreadcrumbsSlice(...a),
        ...createCapletSlice(...a),
        ...createContentPoolSlice(...a),
        ...createDatabaseSlice(...a),
        ...createNetworkSlice(...a),
        ...createQueueSlice(...a),
      }),
      {
        name: "bound-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
