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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { useCapsuleClient } from "@/hooks/use-capsule-client";
import { toast } from "@/hooks/use-toast";
import { useBoundStore } from "@/stores/global.store.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(100),
});

export type CreateDatabaseFormValues = z.infer<typeof formSchema>;

export const DataDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateDatabaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const client = useCapsuleClient();

  const loadDatabases = async () => {
    setIsLoading(true);
    try {
      const databases = await client?.getAllDatabases();
      console.log(databases);
      setDatabases(databases);
    } catch (error) {
      toast({
        title: `Failed to load Databases`,
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDatabases = useBoundStore((state) => state.setDatabases);
  const databases = useBoundStore((state) => state.databases);
  const onSubmit = (values: CreateDatabaseFormValues) => {
    client?.createDatabase(values);
  };

  useEffect(() => {
    loadDatabases();
  }, []);

  return (
    <div className="hidden h-2/3 w-full px-20 m-auto flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Databases</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => {}} className="border">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Database
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-zinc-800/50 bg-background">
              <DialogHeader>
                <DialogTitle className="custom-text text-xl font-light text-zinc-100">
                  Create Database
                </DialogTitle>
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
                        <FormControl>
                          <div className="flex flex-col gap-4 py-3">
                            <Input
                              id="name"
                              placeholder="Enter database name..."
                              className="w-full border rounded-md bg-transparent text-white"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      className="bg-transparent border hover:bg-ring text-ring hover:text-white"
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {databases.map((db) => (
            <DatabaseCard key={db.id} database={db} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/data/")({
  component: DataDashboard,
});
