import { EventsTable } from "@/components/ressources-tables/EventsTable";
import { PersonTable } from "@/components/ressources-tables/PersonTable";
import { TasksTable } from "@/components/ressources-tables/TaskTable";
import { createFileRoute, useParams } from "@tanstack/react-router";

const ModelScreen = () => {
  const { model } = useParams({
    from: "/_authenticated/models/$model",
  });

  const renderModel = () => {
    switch (model) {
      case "tasks":
        return <TasksTable />;
      case "persons":
        return <PersonTable />;
      case "events":
        return <EventsTable />;
      default:
        return null;
    }
  };

  return (
    <div className="hidden h-2/3 w-full px-20 m-auto flex-1 flex-col space-y-8 p-8 md:flex">
      {renderModel()}
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/models/$model")({
  component: ModelScreen,
});
