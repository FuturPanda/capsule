import { EditorContent, useEditor } from "@tiptap/react";
import { forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils.ts";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Plugin, PluginKey } from "@tiptap/pm/state";

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
  getSQL: () => string;
}

const CodeBlockPlaceholder = Extension.create({
  name: "codeBlockPlaceholder",

  addOptions() {
    return {
      placeholder: "-- Write your SQL query here",
      showOnlyWhenEmpty: true,
    };
  },

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey("codeBlockPlaceholder");

    return [
      new Plugin({
        key: pluginKey,
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = [];
            const doc = state.doc;

            if (!doc.textContent.trim().length) {
              doc.descendants((node, pos) => {
                if (node.type.name === "codeBlock") {
                  decorations.push(
                    Decoration.node(pos, pos + node.nodeSize, {
                      class: "is-empty",
                      "data-placeholder": this.options.placeholder,
                    }),
                  );
                }
              });
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

const lowlight = createLowlight(common);
const SQLiteCodeBlock = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: "sql",
  HTMLAttributes: {
    class: "sql-editor",
  },
});

const CustomDocument = Document.extend({
  content: "codeBlock",
});
const extensions = [
  StarterKit.configure({ codeBlock: false }),
  CustomDocument,
  CodeBlockPlaceholder.configure({
    placeholder: "-- Write your SQL query here -- Example: SELECT * FROM users",
  }),
  SQLiteCodeBlock,
];

export const SqlEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ content, onChange, className, ...props }, ref) => {
    const editor = useEditor({
      extensions,
      onUpdate: (e) => {
        console.log(e.editor.getHTML());
      },
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
      getSQL: () => editor?.getText() ?? "",
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
SqlEditor.displayName = "SqlEditor";

export default SqlEditor;
