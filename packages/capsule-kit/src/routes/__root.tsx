import { Toaster } from "@/components/ui/toaster.tsx";
import { CapsuleClient } from "@capsule-mono-repo/capsule-client";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export interface MyRouterContext {
  capsuleClient?: CapsuleClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    return (
      <>
        <Toaster />
        <Outlet />
      </>
    );
  },
});
