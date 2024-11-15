import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Typography } from "@tiptap/extension-typography";
import { forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils.ts";

const extensions = [StarterKit, Typography];

interface TiptapEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface TiptapEditorRef {
  focus: () => void;
  blur: () => void;
  clearContent: () => void;
  getHTML: () => string;
}

export const Tiptap = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ content, onChange, className, ...props }, ref) => {
    const editor = useEditor({
      extensions,
      onUpdate: (e) => {
        onChange(e.editor.getHTML());
      },
      content: content,
      editorProps: {
        attributes: {
          class:
            "tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        },
      },
      ...props,
    });

    useImperativeHandle(ref, () => ({
      focus: () => editor?.commands.focus(),
      blur: () => editor?.commands.blur(),
      clearContent: () => editor?.commands.clearContent(),
      getHTML: () => editor?.getHTML() ?? "",
    }));

    return (
      <>
        <EditorContent
          className={cn(
            "border-none text-white placeholder:text-gray-500",
            className,
          )}
          editor={editor}
        />
      </>
    );
  },
);
Tiptap.displayName = "Tiptap";

export default Tiptap;
