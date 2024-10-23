import { AuthContextType } from "@/_utils/providers/contexts/AuthContext";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface MyRouterContext {
  auth: AuthContextType;
}

// const TanStackRouterDevtools =
//   process.env.NODE_ENV === "production"
//     ? () => null
//     : React.lazy(() =>
//         import("@tanstack/router-devtools").then((res) => ({
//           default: res.TanStackRouterDevtools,
//         })),
//       );

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      {/* <Suspense>
        <TanStackRouterDevtools />
      </Suspense> */}
    </>
  ),
});
