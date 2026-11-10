"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Building2Icon, CheckIcon, ChevronsUpDownIcon, TreePalmIcon } from "lucide-react";
import { saveFavorites, type FavoritesFormState } from "@/app/painel/actions";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type FavoriteOption = {
  id: string;
  nome: string;
  bairro: string;
  segmento: "imovel" | "refugio";
};

const initialState: FavoritesFormState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return <Button disabled={pending} type="submit">{pending ? "Salvando…" : "Salvar"}</Button>;
}

export function FavoritesDialog({ initialIds, options }: { initialIds: string[]; options: FavoriteOption[] }) {
  const router = useRouter();
  const [state, action] = useActionState(saveFavorites, initialState);
  const [selected, setSelected] = useState(() => Array.from({ length: 6 }, (_, index) => initialIds[index] || ""));

  useEffect(() => {
    if (state.success) router.back();
  }, [router, state.success]);

  function close() {
    router.back();
  }

  return (
    <Dialog onOpenChange={(open) => { if (!open) close(); }} open>
      <DialogContent className="admin-theme dark max-h-[90vh] overflow-y-auto sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader className="pr-10">
          <DialogTitle className="text-xl">Favoritos</DialogTitle>
          <DialogDescription>Escolha seis imóveis ou refúgios para compor a seleção de favoritos.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {selected.map((id, index) => (
              <FavoriteSelect
                index={index}
                key={index}
                onChange={(nextId) => setSelected((current) => current.map((item, itemIndex) => itemIndex === index ? nextId : item))}
                options={options}
                selectedIds={selected}
                value={id}
              />
            ))}
          </div>
          {state.error ? <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{state.error}</p> : null}
          <DialogFooter className="mx-0 mb-0 px-0 pb-0">
            <Button onClick={close} type="button" variant="outline">Cancelar</Button>
            <SaveButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FavoriteSelect({
  index,
  onChange,
  options,
  selectedIds,
  value,
}: {
  index: number;
  onChange: (id: string) => void;
  options: FavoriteOption[];
  selectedIds: string[];
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.id === value);
  return (
    <Field>
      <FieldLabel>Produto {index + 1}</FieldLabel>
      <input name={`favorite_${index + 1}`} type="hidden" value={value} />
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="h-11 w-full justify-between rounded-xl px-3 font-normal" role="combobox" type="button" variant="outline">
            <span className={cn("min-w-0 truncate", !current && "text-muted-foreground")}>{current?.nome || "Selecionar produto"}</span>
            <ChevronsUpDownIcon className="shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="admin-theme dark w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder="Buscar por nome, bairro ou tipo…" />
            <CommandList>
              <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
              {options.map((option) => {
                const alreadySelected = selectedIds.includes(option.id) && option.id !== value;
                return (
                  <CommandItem
                    disabled={alreadySelected}
                    key={option.id}
                    onSelect={() => { onChange(option.id); setOpen(false); }}
                    value={`${option.nome} ${option.bairro} ${option.segmento === "refugio" ? "refúgio" : "imóvel"}`}
                  >
                    {option.segmento === "refugio" ? <TreePalmIcon /> : <Building2Icon />}
                    <span className="min-w-0 flex-1"><span className="block truncate">{option.nome}</span><span className="block truncate text-xs text-muted-foreground">{option.segmento === "refugio" ? "Refúgio" : "Imóvel"} · {option.bairro}</span></span>
                    {value === option.id ? <CheckIcon /> : null}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
