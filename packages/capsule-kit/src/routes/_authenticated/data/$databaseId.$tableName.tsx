import TaskPage from "@/components/tasks/page.tsx";
import { databaseRequest } from "@/stores/databases/database.request.ts";
import { useBoundStore } from "@/stores/global.store.ts";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const TableDetailsComponent = () => {
  const { databaseId, tableName } = useParams({
    from: "/_authenticated/data/$databaseId/$tableName",
  });
  console.log("PARAMAS", { databaseId, tableName });
  const findDb = useBoundStore((state) => state.findDatabase);
  const findTable = useBoundStore((state) => state.findTable);
  const table = findTable(databaseId, tableName);
  const database = findDb(databaseId);

  const { data, isLoading } = useQuery({
    queryKey: ["table", tableName, databaseId],
    queryFn: () =>
      databaseRequest.queryDatabase(database?.name ?? "", tableName ?? "", {}),
  });

  console.log("DATA ====", data);
  console.log("TABLE ====", table);
  console.log("DATABASE ====", database);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {table && data ? (
        <TaskPage table={table} data={data} />
      ) : (
        <div>No table or data found</div>
      )}
    </div>
  );
};

export const Route = createFileRoute(
  "/_authenticated/data/$databaseId/$tableName",
)({
  component: TableDetailsComponent,
});
