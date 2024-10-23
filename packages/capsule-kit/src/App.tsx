import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./_utils/providers/contexts/AuthContext";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
};
