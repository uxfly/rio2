"use client";

import { useRef, useState } from "react";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AdminSlugField({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [draft, setDraft] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEditing() {
    setDraft(value);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function saveSlug() {
    const normalized = normalizeSlug(draft);
    setValue(normalized);
    setDraft(normalized);
    setEditing(false);
  }

  function cancelEditing() {
    setDraft(value);
    setEditing(false);
  }

  return (
    <div className="space-y-3">
      <Input
        aria-label="Slug"
        name="slug"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && editing) {
            event.preventDefault();
            saveSlug();
          }
          if (event.key === "Escape" && editing) cancelEditing();
        }}
        placeholder="Gerado automaticamente"
        readOnly={!editing}
        ref={inputRef}
        value={editing ? draft : value}
      />
      <div className="flex gap-2">
        {editing ? (
          <>
            <Button className="flex-1" onClick={saveSlug} size="sm" type="button">
              <CheckIcon /> Salvar
            </Button>
            <Button aria-label="Cancelar edição do slug" onClick={cancelEditing} size="icon-sm" type="button" variant="secondary">
              <XIcon />
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={startEditing} size="sm" type="button" variant="secondary">
            <PencilIcon /> Editar
          </Button>
        )}
      </div>
    </div>
  );
}
