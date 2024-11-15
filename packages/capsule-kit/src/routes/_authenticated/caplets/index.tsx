import { createFileRoute } from "@tanstack/react-router";
import { CapletDashboard } from "@/components/caplets/CapletDashboard.tsx";

export const Route = createFileRoute("/_authenticated/caplets/")({
  component: () => <CapletDashboard />,
});
