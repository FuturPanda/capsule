import { GetEntitiesDto } from "@/stores/databases/database.model.ts";
import { useColumnDefs2 } from "./components/columns";
import { DataTable } from "./components/data-table";

interface TaskPageProps {
  table: GetEntitiesDto;
  data: Record<string, unknown>[];
}

export default function TaskPage({ table, data }: TaskPageProps) {
  const columns = useColumnDefs2(table);
  console.log("columns", columns);
  return (
    <>
      <div className="hidden h-full flex-1 flex-col md:flex">
        {data ? <DataTable data={data} columns={columns} /> : <></>}
      </div>
    </>
  );
}
