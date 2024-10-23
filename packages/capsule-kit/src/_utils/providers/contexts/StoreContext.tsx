import { RootStore } from "@/stores/root.store";
import React from "react";

export const StoreContext = React.createContext<RootStore | null>(null);

export const useStores = () => {
  const context = React.useContext(StoreContext);
  if (context === null) {
    throw new Error("useStores must be used within a StoreProvider");
  }
  return React.useMemo(() => context, [context]);
};
