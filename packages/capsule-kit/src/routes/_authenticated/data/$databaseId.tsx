import {
  createFileRoute,
  Link,
  Outlet,
  useParams,
} from "@tanstack/react-router";
import { useBoundStore } from "@/stores/global.store.ts";
import { useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { ComboboxDatabase } from "@/components/ComboBoxDatabase.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";

const DatabaseScreen = () => {
  const { databaseId } = useParams({
    from: "/_authenticated/data/$databaseId",
  });
  const findDb = useBoundStore((state) => state.findDatabase);
  const databases = useBoundStore((state) => state.databases);
  const database = findDb(databaseId);
  const [selectedDb, setSelectedDb] = useState(database?.name ?? "");

  return (
    <div className="flex gap-2.5 w-full">
      <Card
        className={cn(
          "w-[calc(20%-5px)] h-[calc(var(--sidebar-height)_-_10px)] p-10 ",
        )}
      >
        <ComboboxDatabase
          databases={databases}
          selectedDb={selectedDb}
          setSelectedDb={setSelectedDb}
        />
        <Separator />
        <div className="flex items-center justify-between">
          <Link
            to="/data/$databaseId/query"
            params={{ databaseId: databaseId }}
          >
            <h2 className="text-2xl font-bold tracking-tight mb-8">Queries</h2>
          </Link>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-8">Tables</h2>
        <div className="space-y-2">
          {database?.entities.map((table) => (
            <Button
              key={table.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal",
                "dark:hover:bg-muted dark:hover:text-white",
              )}
            >
              <Link
                to="/data/$databaseId/$tableId"
                params={{ databaseId: databaseId, tableId: table.id }}
                className="w-full"
                activeOptions={{ exact: true }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{table.name}</span>
                  {table.name && (
                    <span className="text-sm text-muted-foreground truncate">
                      {table.name}
                    </span>
                  )}
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </Card>
      <Card
        className={cn(
          "w-[calc(80%-10px)] h-[calc(var(--sidebar-height)_-_10px)] p-10",
        )}
      >
        <Outlet />
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/data/$databaseId")({
  component: DatabaseScreen,
});
