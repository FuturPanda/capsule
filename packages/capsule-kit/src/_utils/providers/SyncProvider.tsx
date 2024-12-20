import { FC, ReactNode, useEffect } from "react";
import { useBoundStore } from "@/stores/global.store.ts";

interface SyncProps {
  children: ReactNode;
}

export const SyncProvider: FC<SyncProps> = ({ children }) => {
  const hasChanged = useBoundStore((state) => state.hasChanged);
  const toggleHasChanged = useBoundStore((state) => state.toggleHasChanged);
  const initializeCaplets = useBoundStore((state) => state.initializeCaplets);
  const initializeContentPool = useBoundStore(
    (state) => state.initializeContentPool,
  );

  useEffect(() => {
    console.log("INIT SYNC : ", hasChanged);
    if (hasChanged) {
      initializeCaplets();
      initializeContentPool();
    }
    toggleHasChanged();
  }, [initializeCaplets, initializeContentPool, toggleHasChanged, hasChanged]);

  return children;
};
