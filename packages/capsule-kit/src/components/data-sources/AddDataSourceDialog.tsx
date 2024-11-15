import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useBoundStore } from "@/stores/global.store.ts";

const createDataSourceFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  description: z.string().optional(),
});

type createDataSourceValues = z.infer<typeof createDataSourceFormSchema>;

export const AddDataSourceDialog = () => {
  const addDataSource = useBoundStore((state) => state.addDataSource);

  const form = useForm<createDataSourceValues>({
    resolver: zodResolver(createDataSourceFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: createDataSourceValues) {
    console.log(values);
    addDataSource(values.name, values.description);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="mt-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium px-8"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create new data source
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 bg-zinc-950 text-zinc-100">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xl">
                <span className="text-zinc-400">Add a data source</span>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* General Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-zinc-200">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="name"
                              type="text"
                              className="bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:ring-zinc-700 focus:border-zinc-700"
                              placeholder="Enter a name for this data source"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-zinc-200">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              id="description"
                              className="bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:ring-zinc-700 focus:border-zinc-700 min-h-[100px]"
                              placeholder="Add an optional description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-3 align-end justify-end">
              <Button
                variant="outline"
                className="border-zinc-800 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
                Create Data Source
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
