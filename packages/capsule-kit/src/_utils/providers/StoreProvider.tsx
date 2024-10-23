import { RootStore } from "@/stores/root.store";
import React from "react";
import { StoreContext } from "./contexts/StoreContext";

interface StoreProviderProps {
  rootStore: RootStore;
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({
  rootStore,
  children,
}) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};
