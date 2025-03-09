import { CustomCombobox } from "@/components/ComboBoxDatabase";
import { Button } from "@/components/ui/button.tsx";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useBoundStore } from "@/stores/global.store.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import {
  createFileRoute,
  Outlet,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { CreateDatabaseFormValues } from ".";

const formSchema = z.object({
  name: z.string().min(2).max(100),
});

const DatabaseScreen = () => {
  const navigate = useNavigate();
  const form = useForm<CreateDatabaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const { databaseId } = useParams({
    from: "/_authenticated/data/$databaseId",
  });
  const findDb = useBoundStore((state) => state.findDatabase);
  const database = findDb(databaseId);
  const [selectedTable, setSelectedTable] = useState(null);

  const onSubmit = () => {};

  useEffect(() => {
    if (database?.entities && database.entities.length > 0) {
      // Set the selected table in the store
      setSelectedTable(database.entities[0]);

      // Navigate to the first table
      navigate({
        to: "/data/$databaseId/$tableName",
        params: {
          databaseId: databaseId,
          tableName: database.entities[0].tableName,
        },
      });
    }
  }, []);

  return (
    <div className="hidden h-2/3 w-full px-20 m-auto flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {database?.name.slice(0, 1).toUpperCase() +
                database?.name.slice(1)}
            </h2>
            <CustomCombobox
              choiceLabel="Tables"
              choices={database?.entities ?? []}
              nameKey="tableName"
              selected={selectedTable}
              callback={(table: GetEntities) => {
                setSelectedTable(table);
                navigate({
                  to: "/data/$databaseId/$tableName",
                  params: {
                    databaseId: databaseId,
                    tableName: table.tableName,
                  },
                });
              }}
            />
          </div>
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
                          <div className="flex flex-col gap-4 py-3"></div>
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
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/data/$databaseId")({
  component: DatabaseScreen,
});
