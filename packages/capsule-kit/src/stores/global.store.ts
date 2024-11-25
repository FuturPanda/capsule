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
  createDataSourceSlice,
  DataSourceSlice,
} from "@/stores/data-sources/data-source.store.ts";
import {
  createNetworkSlice,
  NetworkSlice,
} from "@/stores/network/network.store.ts";
import { createQueueSlice, QueueSlice } from "@/stores/queue/queue.store.ts";

export type BoundStore = UserSlice &
  CapletSlice &
  ContentPoolSlice &
  DataSourceSlice &
  NetworkSlice &
  QueueSlice;

export const useBoundStore = create<BoundStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createUserSlice(...a),
        ...createCapletSlice(...a),
        ...createContentPoolSlice(...a),
        ...createDataSourceSlice(...a),
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
