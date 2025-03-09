import { Checkbox } from "@/components/ui/checkbox.tsx";
import { GetEntitiesDto } from "@/stores/databases/database.model.ts";
import { CheckIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { useMemo } from "react";
import { DataTableColumnHeader } from "./data-table-column-header";

function formatColumnTitle(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderCellContent(value: unknown, type: string): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>;
  }

  switch (type.toLowerCase()) {
    case "uuid":
      return (
        <div className="font-mono text-xs text-muted-foreground">
          {value as string}
        </div>
      );
    case "varchar":
    case "text":
      return <div className="max-w-[500px] truncate">{value as string}</div>;

    case "decimal":
    case "numeric":
      return <div className="text-right">{value as string}</div>;

    case "timestamp":
    case "date":
      try {
        const date = new Date(value as string);
        return <div className="text-right">{date.toLocaleString()}</div>;
      } catch (e: unknown) {
        console.log("Error formatting date:", value, e);
        return <div className="text-right">{String(value)}</div>;
      }
    case "boolean":
      return (
        <div className="flex items-center">
          {value ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <XIcon className="h-4 w-4 text-red-500" />
          )}
        </div>
      );
    default:
      return String(value);
  }
}

export function useColumnDefs2(table: GetEntitiesDto) {
  const columns: ColumnDef<Record<string, unknown>>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...table.columns.map(
        (column): ColumnDef<Record<string, unknown>> => ({
          accessorKey: column.name,
          header: ({ column: tableColumn }) => (
            <DataTableColumnHeader
              column={tableColumn}
              title={formatColumnTitle(column.name)}
            />
          ),
          cell: ({ row }) => {
            const value = row.getValue(column.name);
            return renderCellContent(value, column.type);
          },
          enableSorting: true,
          enableHiding: false,
        }),
      ),
    ],
    [table],
  );

  return columns;
}
