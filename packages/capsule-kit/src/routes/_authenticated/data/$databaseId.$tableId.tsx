import { createFileRoute, useParams } from "@tanstack/react-router";
import TaskPage from "@/components/tasks/page.tsx";
import { useQuery } from "@tanstack/react-query";
import { databaseRequest } from "@/stores/databases/database.request.ts";
import { useBoundStore } from "@/stores/global.store.ts";

const TableDetailsComponent = () => {
  const { databaseId, tableId } = useParams({
    from: "/_authenticated/data/$databaseId/$tableId",
  });
  const findDb = useBoundStore((state) => state.findDatabase);
  const findTable = useBoundStore((state) => state.findTable);
  const table = findTable(databaseId, tableId);
  const database = findDb(databaseId);
  const query = useQuery({
    queryKey: ["table", tableId],
    queryFn: () =>
      databaseRequest.queryDatabase(
        database?.name ?? "",
        table?.name ?? "",
        {},
      ),
  });
  console.log(query.data);
  return (
    <div>{table ? <TaskPage table={table} data={query.data} /> : <></>}</div>
  );
};

export const Route = createFileRoute(
  "/_authenticated/data/$databaseId/$tableId",
)({
  component: TableDetailsComponent,
});
