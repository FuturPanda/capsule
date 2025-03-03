import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { useBoundStore } from "@/stores/global.store.ts";
import {
  createFileRoute,
  Link,
  Outlet,
  useParams,
} from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  Database,
  FileText,
  Search,
} from "lucide-react";
import { useState } from "react";

const DatabaseScreen = () => {
  const { databaseId } = useParams({
    from: "/_authenticated/data/$databaseId",
  });
  const findDb = useBoundStore((state) => state.findDatabase);
  const database = findDb(databaseId);
  const [activeTable, setActiveTable] = useState("");

  // Function to get appropriate icon based on table name
  const getTableIcon = (tableName) => {
    if (
      tableName.toLowerCase().includes("database") ||
      tableName.toLowerCase().includes("changelog")
    ) {
      return <Database className="h-4 w-4 mr-2" />;
    } else if (tableName.toLowerCase().includes("content")) {
      return <FileText className="h-4 w-4 mr-2" />;
    } else if (tableName.toLowerCase().includes("query")) {
      return <Search className="h-4 w-4 mr-2" />;
    } else {
      return <BarChart3 className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <Card
        className={cn(
          "w-full lg:w-[320px] h-auto lg:h-[calc(var(--sidebar-height)_-_10px)]",
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight flex items-center">
            <Database className="h-5 w-5 mr-2" /> Tables
          </h2>
        </div>

        <div className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {database?.entities.map((table) => (
            <Button
              key={table.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal mb-1 p-3",
                "transition-all duration-200 ease-in-out",
                activeTable === table.tableName ? "bg-muted" : "",
                "rounded-lg group",
              )}
              onClick={() => setActiveTable(table.tableName)}
            >
              <Link
                to="/data/$databaseId/$tableName"
                params={{ databaseId: databaseId, tableName: table.tableName }}
                className="w-full flex items-center"
                activeOptions={{ exact: true }}
              >
                <div className="flex items-center w-full">
                  <div className="flex flex-col flex-grow">
                    <span className="font-medium">{table.tableName}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </Card>

      <Card
        className={cn(
          "w-full lg:flex-1 h-auto lg:h-[calc(var(--sidebar-height)_-_10px)]",
        )}
      >
        <div className="h-full flex flex-col">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium">
              {activeTable ? activeTable : "Select a table"}
            </h3>
          </div>
          <div className="flex-grow p-4 overflow-auto">
            <Outlet />
          </div>
        </div>
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/data/$databaseId")({
  component: DatabaseScreen,
});
