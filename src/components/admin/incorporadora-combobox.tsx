"use client";

import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function IncorporadoraCombobox({ defaultValue = "", options = [] }: { defaultValue?: string; options?: string[] }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <>
      <input name="incorporadora" type="hidden" value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="h-10 w-full justify-between rounded-full px-4 font-normal" role="combobox" type="button" variant="outline">
            <span className={value ? "" : "text-muted-foreground"}>
              {value || "Selecionar incorporadora"}
            </span>
            <ChevronsUpDownIcon className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="admin-theme dark w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder="Buscar incorporadora…" />
            <CommandList>
              <CommandEmpty>Nenhuma incorporadora cadastrada.</CommandEmpty>
              {options.map((item) => (
                <CommandItem
                  data-checked={value === item}
                  key={item}
                  onSelect={() => {
                    setValue(item);
                    setOpen(false);
                  }}
                  value={item}
                >
                  {item}
                  {value === item ? <CheckIcon className="ml-auto" /> : null}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
