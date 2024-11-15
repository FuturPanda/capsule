import { useBoundStore } from "@/stores/global.store.ts";
import Tiptap, { TiptapEditorRef } from "@/components/tiptap/Tiptap.tsx";
import React, { useCallback, useRef } from "react";
import { PopoverCardMenu } from "@/components/popovers/PopoverCardMenu.tsx";

export interface TextContentProps {
  capletId: string;
  contentId: string;
}

export const TextContent = ({ capletId, contentId }: TextContentProps) => {
  const editorRef = useRef<TiptapEditorRef>(null);

  const content = useBoundStore((state) => state.findContent(contentId));
  const updateContent = useBoundStore((state) => state.updateContent);
  const removeContent = useBoundStore((state) => state.removeContentFromCaplet);

  const onChange = useCallback(
    (value: string) => {
      updateContent(content!.id, { value: value });
      console.log(value);
    },
    [content, updateContent],
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
        <PopoverCardMenu onDelete={() => removeContent(capletId, contentId)} />
      </div>
    </div>
  );
};
