"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  Undo2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  defaultValue = "",
  name,
}: {
  defaultValue?: string;
  name: string;
}) {
  const [html, setHtml] = useState(defaultValue);
  const editor = useEditor({
    content: defaultValue,
    extensions: [StarterKit],
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => setHtml(currentEditor.getHTML()),
  });

  const tools = [
    {
      label: "Negrito",
      icon: BoldIcon,
      active: editor?.isActive("bold"),
      action: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: "Itálico",
      icon: ItalicIcon,
      active: editor?.isActive("italic"),
      action: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: "Título",
      icon: Heading2Icon,
      active: editor?.isActive("heading", { level: 2 }),
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Lista",
      icon: ListIcon,
      active: editor?.isActive("bulletList"),
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Lista numerada",
      icon: ListOrderedIcon,
      active: editor?.isActive("orderedList"),
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Citação",
      icon: QuoteIcon,
      active: editor?.isActive("blockquote"),
      action: () => editor?.chain().focus().toggleBlockquote().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-input/20 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
      <input name={name} type="hidden" value={html} />
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/35 p-2">
        {tools.map(({ active, action, icon: Icon, label }) => (
          <Button
            aria-label={label}
            className={cn(active && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
            disabled={!editor}
            key={label}
            onClick={action}
            size="icon-sm"
            title={label}
            type="button"
            variant="ghost"
          >
            <Icon />
          </Button>
        ))}
        <span className="mx-1 h-5 w-px bg-border" />
        <Button aria-label="Desfazer" disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()} size="icon-sm" title="Desfazer" type="button" variant="ghost">
          <Undo2Icon />
        </Button>
        <Button aria-label="Refazer" disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()} size="icon-sm" title="Refazer" type="button" variant="ghost">
          <Redo2Icon />
        </Button>
      </div>
      <EditorContent
        className="[&_.ProseMirror]:min-h-72 [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror_blockquote]:my-3 [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-primary [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_h2]:my-3 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6"
        editor={editor}
      />
    </div>
  );
}
