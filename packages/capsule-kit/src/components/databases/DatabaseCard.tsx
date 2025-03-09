import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetDatabaseDto } from "@/stores/databases/database.model.ts";
import { useBoundStore } from "@/stores/global.store";
import { Link } from "@tanstack/react-router";
import { DatabaseIcon } from "lucide-react";

interface DatabaseCardProps {
  database: GetDatabaseDto;
}

export function DatabaseCard({ database }: DatabaseCardProps) {
  const setSelectedDatabase = useBoundStore(
    (state) => state.setSelectedDatabaseId,
  );

  return (
    <Link
      onClick={() => setSelectedDatabase(database.id)}
      to={`/data/${database.id}`}
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5" />
            {database.name}
          </CardTitle>
          <CardDescription>SQLite</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tables: {database.entities.length}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
