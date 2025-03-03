import { DatabaseCard } from "@/components/databases/DatabaseCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { databaseRequest } from "@/stores/databases/database.request.ts";
import { useBoundStore } from "@/stores/global.store.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(100),
});

export type CreateDatabaseFormValues = z.infer<typeof formSchema>;

export const DataDashboard = () => {
  const form = useForm<CreateDatabaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const query = useQuery({
    queryKey: ["databases"],
    queryFn: databaseRequest.getAllDatabases,
  });
  const setDatabases = useBoundStore((state) => state.setDatabases);
  const mutation = useMutation({
    mutationFn: (dbDto: CreateDatabaseFormValues) => {
      return databaseRequest.createDatabase(dbDto);
    },
  });
  const onSubmit = (values: CreateDatabaseFormValues) => {
    console.log(values);
    console.log("HELLOOOOOOOO");
    mutation.mutate(values);
  };
  useEffect(() => {
    setDatabases(query.data ?? []);
  }, [query.data, setDatabases]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Databases</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Database</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Database</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4 py-3">
                          <Input
                            id="name"
                            placeholder="Database name..."
                            className="w-full"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex justify-end pt-2">
                  {/* <DialogClose asChild> */}
                  <Button type="submit">Create</Button>
                  {/* </DialogClose> */}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {query.isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading databases...</p>
        </div>
      ) : query.data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {query.data.map((db) => (
            <DatabaseCard key={db.id} database={db} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-muted-foreground mb-4">No databases found</p>
          <p className="text-sm text-muted-foreground">
            Create your first database to get started
          </p>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/data/")({
  component: DataDashboard,
});
