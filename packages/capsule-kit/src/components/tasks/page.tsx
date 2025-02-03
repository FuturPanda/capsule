import { useColumnDefs2 } from "@/components/tasks/components/columns.tsx";
import { GetEntitiesDto } from "@/stores/databases/database.model.ts";
import { DataTable } from "@/components/tasks/components/data-table.tsx";

interface TaskPageProps {
  table: GetEntitiesDto;
  data: Record<string, unknown>[];
}

export default function TaskPage({ table, data }: TaskPageProps) {
  const columns = useColumnDefs2(table);
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        {data ? <DataTable data={data} columns={columns} /> : <></>}
      </div>
    </>
  );
}
