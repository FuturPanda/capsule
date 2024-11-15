import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/components/Dashboard.tsx";

const HomeComponent = () => {
  return <Dashboard />;
};

export const Route = createFileRoute("/_authenticated/")({
  component: HomeComponent,
});
