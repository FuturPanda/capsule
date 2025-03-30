import Tiptap, { TiptapEditorRef } from "@/components/tiptap/Tiptap";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function CapletComponent() {
  const [title, setTitle] = useState<string | undefined>("");
  const [value, setValue] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { capletId } = Route.useParams();
  const editorRef = useRef<TiptapEditorRef>(null);

  const debouncedCallback = useDebouncedCallback((value: string) => {
    localStorage.setItem(capletId, value);
  }, 1000);

  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      debouncedCallback(value);
    },
    [debouncedCallback],
  );

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest(".button-container")) {
      editorRef.current?.focus();
    }
  };

  useEffect(() => {
    const title = localStorage.getItem(`${capletId}::TITLE`);
    const capletLS = localStorage.getItem(capletId);
    const content = capletLS || "Let Your creativity flow";
    if (title) setTitle(title);
    setValue(content);
    setIsLoaded(true);
  }, [capletId]);

  return (
    <div className="flex flex-col h-full px-6 py-4 overflow-y-auto overflow-x-hidden w-full">
      {isLoaded && (
        <div className="max-w-4xl w-full mx-auto">
          <Input
            value={title}
            placeholder="We will need a title"
            onChange={(e) => {
              localStorage.setItem(`${capletId}::TITLE`, e.target.value);
              setTitle(e.target.value);
            }}
            className="text-4xl font-bold p-0 text-ring border-none focus-visible:ring-0 w-full"
          />

          <div
            className="my-3 group relative flex items-start border border-transparent w-full"
            onMouseDown={(e) => handleContainerClick(e)}
          >
            <div className="flex-1 flex items-center w-full gap-2 mb-1 overflow-hidden">
              <Tiptap
                content={value}
                onChange={onChange}
                ref={editorRef}
                className="w-full min-h-[calc(100vh-200px)] overflow-x-hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/caplets/$capletId")({
  component: CapletComponent,
});
