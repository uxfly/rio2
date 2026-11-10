"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, ImagePlusIcon, LoaderCircleIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function SortableMedia({ path, position, remove }: { path: string; position: number; remove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: path });

  return (
    <div
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted shadow-sm",
        isDragging && "z-20 opacity-70 ring-2 ring-primary",
      )}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <Image alt="" className="object-cover" fill sizes="(max-width: 640px) 50vw, 220px" src={path} />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-2 pb-6">
        <button
          {...attributes}
          {...listeners}
          aria-label={`Mover imagem ${position}`}
          className="flex size-8 cursor-grab touch-none items-center justify-center rounded-lg bg-black/55 text-white active:cursor-grabbing"
          type="button"
        >
          <GripVerticalIcon className="size-4" />
        </button>
        <button
          aria-label={`Excluir ${path.split("/").at(-1)}`}
          className="flex size-8 items-center justify-center rounded-lg bg-black/55 text-white transition-colors hover:bg-destructive"
          onClick={remove}
          type="button"
        >
          <XIcon className="size-4" />
        </button>
      </div>
      <span className="absolute bottom-2 left-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-xs font-semibold text-white">
        {position}
      </span>
    </div>
  );
}

export function MediaMultiSelect({
  defaultValue = [],
  label,
  maxItems,
  name,
}: {
  defaultValue?: string[];
  label: string;
  maxItems?: number;
  name: string;
}) {
  const [items, setItems] = useState(defaultValue);
  const [draggingFiles, setDraggingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function reorder({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setItems((current) => {
      const oldIndex = current.indexOf(String(active.id));
      const newIndex = current.indexOf(String(over.id));
      return oldIndex < 0 || newIndex < 0 ? current : arrayMove(current, oldIndex, newIndex);
    });
  }

  async function upload(files: File[]) {
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    const images = maxItems ? validImages.slice(0, maxItems) : validImages;
    if (!images.length) {
      setError("Adicione somente arquivos de imagem.");
      return;
    }

    setUploading(true);
    setError("");
    const body = new FormData();
    images.forEach((file) => body.append("files", file));

    try {
      const response = await fetch("/painel/api/uploads", { method: "POST", body });
      const result = await response.json() as { files?: string[]; error?: string };
      if (!response.ok || !result.files) throw new Error(result.error || "Não foi possível enviar as imagens.");
      setItems((current) => {
        const next = maxItems === 1 ? result.files!.slice(0, 1) : [...current, ...result.files!];
        return maxItems ? next.slice(0, maxItems) : next;
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Não foi possível enviar as imagens.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <input name={name} type="hidden" value={JSON.stringify(items)} />

      {items.length ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={reorder} sensors={sensors}>
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {items.map((path, index) => (
                <SortableMedia
                  key={path}
                  path={path}
                  position={index + 1}
                  remove={() => setItems((current) => current.filter((item) => item !== path))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}

      <button
        className={cn(
          "flex min-h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-5 py-7 text-center transition-colors hover:border-primary/70 hover:bg-primary/5",
          draggingFiles && "border-primary bg-primary/10 ring-3 ring-primary/15",
        )}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); setDraggingFiles(true); }}
        onDragLeave={(event) => { event.preventDefault(); setDraggingFiles(false); }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setDraggingFiles(false);
          void upload(Array.from(event.dataTransfer.files));
        }}
        type="button"
      >
        {uploading ? <LoaderCircleIcon className="size-7 animate-spin text-primary" /> : items.length ? <ImagePlusIcon className="size-7 text-primary" /> : <UploadCloudIcon className="size-8 text-primary" />}
        <span className="font-medium">{uploading ? "Enviando imagens…" : label}</span>
        <span className="text-xs text-muted-foreground">{maxItems === 1 ? "Arraste uma imagem aqui ou clique para selecionar" : "Arraste vários arquivos aqui ou clique para selecionar"}</span>
      </button>
      <input
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        multiple={maxItems !== 1}
        onChange={(event) => void upload(Array.from(event.target.files ?? []))}
        ref={inputRef}
        type="file"
      />
      {error ? <p className="text-xs text-destructive" role="alert">{error}</p> : null}
    </div>
  );
}
