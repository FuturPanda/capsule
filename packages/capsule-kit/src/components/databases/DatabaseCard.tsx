import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatabaseIcon } from "lucide-react";
import { GetDatabaseDto } from "@/stores/databases/database.model.ts";
import { Link } from "@tanstack/react-router";

interface DatabaseCardProps {
  database: GetDatabaseDto;
}

export function DatabaseCard({ database }: DatabaseCardProps) {
  return (
    <Link to={`/data/${database.id}`}>
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
