import SqlEditor, { TiptapEditorRef } from "@/components/tiptap/SqlEditor.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CreateQueryDto } from "@/stores/queries/queries.model.ts";
import { queriesRequest } from "@/stores/queries/queries.request.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    <div className="hidden h-2/3 w-full px-20 m-auto flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Query</h2>
          <Button onClick={() => {}} className="border">
            Run Query
          </Button>
        </div>
        <div className="border rounded-md h-full p-8 flex flex-row gap-10">
          <SqlEditor
            content="<pre><code>-- Your SQL query here : e.g. SELECT * FROM users;</code></pre>"
            onChange={onChange}
            ref={editorRef}
            className="w-full h-full overflow-auto "
          />
        </div>

        <div className="border rounded-md h-full p-8">
          <h3 className="text-slate-800  font-bold tracking-tight">
            Console:{" "}
          </h3>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/query/")({
  component: QueryScreen,
});
