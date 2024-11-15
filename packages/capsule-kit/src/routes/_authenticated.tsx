import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout.tsx";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AppLayout,
});
