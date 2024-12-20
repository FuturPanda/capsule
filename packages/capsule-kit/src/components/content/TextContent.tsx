import Tiptap, { TiptapEditorRef } from "@/components/tiptap/Tiptap.tsx";
import React, { useCallback, useRef } from "react";
import { PopoverCardMenu } from "@/components/popovers/PopoverCardMenu.tsx";
import { useDebouncedCallback } from "use-debounce";
import { GetCapletContentDto } from "@/stores/caplets/caplet.model.ts";
import { useMutation } from "@tanstack/react-query";
import { capletRequest } from "@/stores/caplets/caplet.request.ts";

export interface TextContentProps {
  content: GetCapletContentDto;
}

export const TextContent = ({ content }: TextContentProps) => {
  const editorRef = useRef<TiptapEditorRef>(null);

  const removeContent = () => {};

  const mutation = useMutation({
    mutationFn: (newValue: string) =>
      capletRequest.updateCapletContent(content.id, newValue),
  });

  const debouncedCallback = useDebouncedCallback((value: string) => {
    mutation.mutate(value);
  }, 1000);

  const onChange = useCallback(
    (value: string) => {
      debouncedCallback(value);
      console.log(value);
    },
    [debouncedCallback],
  );

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest(".button-container")) {
      editorRef.current?.focus();
    }
  };

  if (!content) return <></>;

  return (
    <div
      className="my-3 group relative flex items-start border border-transparent hover:border-[hsl(var(--border))] focus-within:border-[hsl(var(--border))]"
      onMouseDown={(e) => handleContainerClick(e)}
    >
      <div className="flex-1 flex items-center w-full gap-2 mb-1">
        <Tiptap
          content={content.value ? (content.value as string) : "Text..."}
          onChange={onChange}
          ref={editorRef}
          className="w-full"
        />
      </div>

      <div className="absolute top-2 right-2 flex gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 z-50 bg-background">
        <PopoverCardMenu onDelete={() => removeContent()} />
      </div>
    </div>
  );
};
