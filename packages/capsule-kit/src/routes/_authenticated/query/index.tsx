import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import SqlEditor, { TiptapEditorRef } from "@/components/tiptap/SqlEditor.tsx";
import { useCallback, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queriesRequest } from "@/stores/queries/queries.request.ts";
import { CreateQueryDto } from "@/stores/queries/queries.model.ts";
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

const formSchema = z.object({
  name: z.string().min(2).max(50),
  content: z.string(),
  database_id: z.string(),
});

export const QueryScreen = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      database_id: "",
    },
  });
  const editorRef = useRef<TiptapEditorRef>(null);
  const onChange = useCallback(
    (value: string) => {
      form.setValue("content", editorRef?.current?.getHTML() ?? "");
      console.log(value);
    },
    [form],
  );
  const query = useQuery({
    queryKey: ["queries"],
    queryFn: queriesRequest.getAllQueries,
  });
  const mutation = useMutation({
    mutationFn: (data: CreateQueryDto) => queriesRequest.saveQuery(data),
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("SUBMITTTT");
    const formData = {
      ...values,
      content: editorRef?.current?.getHTML(),
    };
    console.log(formData);
  };

  return (
    <div className="flex gap-2.5 w-full">
      <Form {...form}>
        <Card
          className={cn(
            "w-[calc(20%-5px)] h-[calc(var(--sidebar-height)_-_10px)] p-10 ",
          )}
        >
          <h2 className="text-2xl font-bold tracking-tight mb-4">Queries</h2>
          <Separator />
          {query.data?.map((query) => <>{JSON.stringify(query)}</>)}
          <div className="flex items-center justify-between"></div>
        </Card>
        <Card
          className={cn(
            "w-[calc(80%-10px)] h-[calc(var(--sidebar-height)_-_10px)] p-10",
          )}
        >
          <div onClick={() => editorRef.current?.focus()}>
            <div className="justify-between flex pb-2 items-center">
              <h2>Run your own query </h2>

              <div className="flex gap-2 items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button asChild={false} variant="ghost" size="default">
                      <Star />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold">
                          Save query
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-8 py-4">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    id="name"
                                    placeholder="New query"
                                    className="pr-20 border-pink-500/20 bg-background"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <DialogClose asChild>
                          <Button
                            variant="secondary"
                            className="bg-muted/50 hover:bg-muted"
                          >
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          type={"submit"}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button asChild={false} variant="outline" size="default">
                  Run Query
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex-1 flex items-center w-full gap-2 mb-1 pt-8">
              <SqlEditor
                content="<pre><code>-- Your SQL query here : e.g. SELECT * FROM users;</code></pre>"
                onChange={onChange}
                ref={editorRef}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      </Form>
    </div>
  );
};
export const Route = createFileRoute("/_authenticated/query/")({
  component: QueryScreen,
});
