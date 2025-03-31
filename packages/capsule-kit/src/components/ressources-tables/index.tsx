import { Button } from "@/components/ui/button";
import { GetEntitiesDto } from "@/stores/databases/database.model";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { useColumnDefs2 } from "../ressources-tables/components/columns";
import { DataTable } from "../ressources-tables/components/data-table";

interface ResourceTableProps<T> {
  resourceName: string;
  tableDefinition: GetEntitiesDto;
  data: Pick<T, keyof T>[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (ids: string[]) => void;
  isLoading?: boolean;
}

export function ResourceTable<T>({
  resourceName,
  tableDefinition,
  data,
  onAdd,
  onEdit,
  onDelete,
  isLoading = false,
}: ResourceTableProps<T>) {
  const columns = useColumnDefs2(tableDefinition);

  const columnsWithActions = useMemo(() => {
    if (!onEdit && !onDelete) return columns;

    const actionColumn: ColumnDef<Record<string, unknown>> = {
      id: "actions",
      cell: ({ row }) => {
        const id = row.original.id as string;
        return (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete([id])}
                className="text-destructive"
              >
                Delete
              </Button>
            )}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    };

    return [...columns, actionColumn];
  }, [columns, onEdit, onDelete]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{resourceName}</h2>
        {onAdd && (
          <Button onClick={onAdd} className="border">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add {resourceName.slice(0, -1)}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="h-[300px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <DataTable columns={columnsWithActions} data={data} />
      )}
    </div>
  );
}
