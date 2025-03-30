import { cn } from "@/lib/utils.ts";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Typography } from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import { forwardRef, useImperativeHandle } from "react";

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

const lowlight = createLowlight(common);

const extensions = [
  StarterKit.configure({ codeBlock: false }),
  Typography,
  CodeBlockLowlight.configure({
    lowlight,
  }),
];

export const Tiptap = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ content, onChange, className, ...props }, ref) => {
    const editor = useEditor({
      extensions,
      onUpdate: (e) => {
        onChange(e.editor.getHTML());
        console.log(e.editor.getHTML());
      },
      content: content,
      editorProps: {
        attributes: {
          class:
            "tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none !ring-0",
        },
      },
      autofocus: "end",
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
