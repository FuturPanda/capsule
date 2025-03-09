import { DataTable } from "@/components/tasks/components/data-table.tsx";
import { GetEntitiesDto } from "@/stores/databases/database.model.ts";
import { useColumnDefs2 } from "./components/columns";

interface TaskPageProps {
  table: GetEntitiesDto;
  data: Record<string, unknown>[];
}

export default function TaskPage({ table, data }: TaskPageProps) {
  const columns = useColumnDefs2(table);
  console.log("columns", columns);
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        {data ? <DataTable data={data} columns={columns} /> : <></>}
      </div>
    </>
  );
}
