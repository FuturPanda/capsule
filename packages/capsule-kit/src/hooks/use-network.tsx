import { useEffect } from "react";
import { useBoundStore } from "@/stores/global.store.ts";

export const useNetworkStatus = () => {
  const isOnline = useBoundStore((state) => state.isOnline);
  const lastOnlineChange = useBoundStore((state) => state.lastOnlineChange);
  const setOnlineStatus = useBoundStore((state) => state.setOnlineStatus);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      console.log("Getting online");
    };

    const handleOffline = () => {
      setOnlineStatus(false);
      console.log("Getting Offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnlineStatus]);

  return {
    isOnline,
    isOffline: !isOnline,
    lastOnlineChange,
  };
};
