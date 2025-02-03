import { createFileRoute } from "@tanstack/react-router";
import { TiptapEditorRef } from "@/components/tiptap/Tiptap.tsx";
import { useCallback, useRef } from "react";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Star } from "lucide-react";
import SqlEditor from "@/components/tiptap/SqlEditor.tsx";

const QueryComponent = () => {
  const editorRef = useRef<TiptapEditorRef>(null);
  const onChange = useCallback((value: string) => {
    console.log(value);
  }, []);
  return (
    <div onClick={() => editorRef.current?.focus()}>
      <div className="justify-between flex pb-2">
        <h2>Run your own query </h2>
        <div className="flex gap-2">
          <Star />
          <Button> Run Query </Button>
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
  );
};
export const Route = createFileRoute("/_authenticated/data/$databaseId/query")({
  component: QueryComponent,
});
