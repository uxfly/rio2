"use client";

import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

function initialCents(value: string) {
  if (!value || value.toLocaleLowerCase("pt-BR").includes("consulta")) return "";

  const numericValue = value.replace(/[^\d,.]/g, "");
  if (!numericValue) return "";

  if (numericValue.includes(",")) {
    const [reais, centavos = ""] = numericValue.split(",");
    return `${reais.replace(/\D/g, "")}${centavos.replace(/\D/g, "").padEnd(2, "0").slice(0, 2)}`.replace(/^0+(?=\d)/, "");
  }

  return `${numericValue.replace(/\D/g, "")}00`.replace(/^0+(?=\d)/, "");
}

function formatCents(cents: string) {
  if (!cents) return "";
  return (Number(cents) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrencyInput({
  defaultValue = "",
  id = "valor",
  name = "valor",
  onValueChange,
}: {
  defaultValue?: string;
  id?: string;
  name?: string;
  onValueChange?: (value: string) => void;
}) {
  const [cents, setCents] = useState(() => initialCents(defaultValue));
  const formatted = formatCents(cents);

  return (
    <InputGroup>
      {name ? <input name={name} type="hidden" value={formatted ? `R$ ${formatted}` : ""} /> : null}
      <InputGroupAddon align="inline-start">
        <InputGroupText>R$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Valor do produto"
        id={id}
        inputMode="numeric"
        onChange={(event) => {
          const nextCents = event.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
          const nextFormatted = formatCents(nextCents);
          setCents(nextCents);
          onValueChange?.(nextFormatted ? `R$ ${nextFormatted}` : "");
        }}
        value={formatted}
      />
    </InputGroup>
  );
}
