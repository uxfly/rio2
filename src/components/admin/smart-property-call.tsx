"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { gerarChamadaImovel } from "@/lib/property-call";

function formValue(form: HTMLFormElement, name: string) {
  return String(new FormData(form).get(name) ?? "");
}

export function SmartPropertyCall({ defaultValue = "" }: { defaultValue?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setValue(gerarChamadaImovel({
          tipoImovel: formValue(form, "tipoImovel"),
          metragem: formValue(form, "metragem"),
          quartos: formValue(form, "quartos"),
          bairro: formValue(form, "bairro"),
        }));
      });
    };
    update();
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("click", update);
    form.addEventListener("property-fields-change", update);
    return () => {
      cancelAnimationFrame(frame);
      form.removeEventListener("input", update);
      form.removeEventListener("change", update);
      form.removeEventListener("click", update);
      form.removeEventListener("property-fields-change", update);
    };
  }, []);

  return <Input name="chamada" readOnly ref={inputRef} value={value} />;
}
