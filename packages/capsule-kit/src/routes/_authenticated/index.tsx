import { createFileRoute } from "@tanstack/react-router";
import { MainCard } from "@/components/MainCard.tsx";

const HomeComponent = () => {
  return <MainCard />;
};

export const Route = createFileRoute("/_authenticated/")({
  component: HomeComponent,
});
