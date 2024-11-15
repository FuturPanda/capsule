import { AuthContextType } from "@/_utils/providers/contexts/AuthContext";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/toaster.tsx";
import { Suspense } from "react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface MyRouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const env = import.meta.env.VITE_ENVIRONMENT;
    return (
      <>
        <Toaster />
        <Outlet />
        {env === "DEV" ? (
          <Suspense>
            <TanStackRouterDevtools position={"bottom-right"} />
          </Suspense>
        ) : (
          <></>
        )}
      </>
    );
  },
});
