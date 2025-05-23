import { CapsuleClientContext } from "@/_utils/providers/CapsuleClientProvider";
import { useContext } from "react";

export const useCapsuleClient = () => {
  const context = useContext(CapsuleClientContext);

  if (context === undefined) {
    throw new Error(
      "useCapsuleClient must be used within a CapsuleClientProvider",
    );
  }

  return context.client;
};
