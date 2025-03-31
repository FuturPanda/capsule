import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useCapsuleClient } from "./hooks/use-capsule-client";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    capsuleClient: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const client = useCapsuleClient();
  return <RouterProvider router={router} context={{ capsuleClient: client }} />;
};
