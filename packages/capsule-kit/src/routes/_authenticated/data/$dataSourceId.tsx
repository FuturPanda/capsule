import { createFileRoute } from "@tanstack/react-router";

export const DataSourceComponent = () => {
  return <></>;
};

export const Route = createFileRoute("/_authenticated/data/$dataSourceId")({
  component: () => <div>Hello /_authenticated/data/$dataSourceId!</div>,
});
