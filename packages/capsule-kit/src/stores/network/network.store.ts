import { StateCreator } from "zustand";

export interface NetworkSlice {
  isOnline: boolean;
  lastOnlineChange: Date | null;
  setOnlineStatus: (status: boolean) => void;
}

export const createNetworkSlice: StateCreator<
  NetworkSlice,
  [],
  [["zustand/persist", unknown]]
> = (set) => ({
  isOnline: navigator.onLine, // Initial state from navigator
  lastOnlineChange: null,
  setOnlineStatus: (status: boolean) =>
    set({
      isOnline: status,
      lastOnlineChange: new Date(),
    }),
});
