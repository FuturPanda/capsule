import { createFileRoute } from "@tanstack/react-router";
import { DatabaseCard } from "@/components/databases/DatabaseCard.tsx";
import { useQuery } from "@tanstack/react-query";
import { databaseRequest } from "@/stores/databases/database.request.ts";
import { useEffect } from "react";
import { useBoundStore } from "@/stores/global.store.ts";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

export const DataDashboard = () => {
  const query = useQuery({
    queryKey: ["databases"],
    queryFn: databaseRequest.getAllDatabases,
  });
  const setDatabases = useBoundStore((state) => state.setDatabases);
  useEffect(() => {
    setDatabases(query.data ?? []);
  }, [query.data, setDatabases]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {!query.data ? (
        <p>No Databases</p>
      ) : (
        query.data?.map((db) => <DatabaseCard key={db.id} database={db} />)
      )}
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <Button className="" variant={"ghost"}>
              <Plus />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Database</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input id="name" placeholder="name..." />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/data/")({
  component: DataDashboard,
});
