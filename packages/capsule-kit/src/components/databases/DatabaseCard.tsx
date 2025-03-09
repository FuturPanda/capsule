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
      className="block transition-transform hover:-translate-y-1"
    >
      <Card className="border bg-background hover:border-teal-500/30 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <DatabaseIcon className="h-5 w-5 text-teal-500" />
            {database.name}
          </CardTitle>
          <CardDescription className="text-zinc-400">SQLite</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-300">Tables: {database.entities.length}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
