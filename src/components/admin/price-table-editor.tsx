"use client";

import { useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { CurrencyInput } from "@/components/admin/currency-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PriceRow = {
  id: string;
  tipologia: string;
  metragem: string;
  valor: string;
};

function parseRows(value: string): PriceRow[] {
  return value
    .split(/\r?\n/)
    .map((line, index) => {
      const [tipologia = "", metragem = "", valor = ""] = line.split("|").map((part) => part.trim());
      return {
        id: `existing-${index}`,
        tipologia,
        metragem: metragem.replace(/\s*m²\s*$/i, ""),
        valor,
      };
    })
    .filter((row) => row.tipologia || row.metragem || row.valor);
}

function serializeRows(rows: PriceRow[]) {
  return rows
    .filter((row) => row.tipologia.trim() || row.metragem.trim() || row.valor.trim())
    .map((row) => [
      row.tipologia.trim(),
      row.metragem.trim() ? `${row.metragem.trim()} m²` : "",
      row.valor.trim(),
    ].join(" | "))
    .join("\n");
}

export function PriceTableEditor({ defaultValue = "" }: { defaultValue?: string }) {
  const [rows, setRows] = useState<PriceRow[]>(() => parseRows(defaultValue));

  function updateRow(id: string, field: keyof Omit<PriceRow, "id">, value: string) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }

  function addRow() {
    setRows((current) => [...current, {
      id: `new-${Date.now()}-${current.length}`,
      tipologia: "",
      metragem: "",
      valor: "",
    }]);
  }

  return (
    <div className="space-y-4">
      <input name="tabelaPreco" type="hidden" value={serializeRows(rows)} />
      {rows.length ? (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Tipologia</TableHead>
                <TableHead className="w-52">Metragem</TableHead>
                <TableHead className="w-64">Valor</TableHead>
                <TableHead className="w-14"><span className="sr-only">Remover</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      aria-label={`Tipologia da linha ${index + 1}`}
                      onChange={(event) => updateRow(row.id, "tipologia", event.target.value)}
                      placeholder="Apartamento"
                      value={row.tipologia}
                    />
                  </TableCell>
                  <TableCell>
                    <InputGroup>
                      <InputGroupInput
                        aria-label={`Metragem da linha ${index + 1}`}
                        inputMode="decimal"
                        onChange={(event) => updateRow(row.id, "metragem", event.target.value)}
                        value={row.metragem}
                      />
                      <InputGroupAddon align="inline-end"><InputGroupText>m²</InputGroupText></InputGroupAddon>
                    </InputGroup>
                  </TableCell>
                  <TableCell>
                    <CurrencyInput
                      defaultValue={row.valor}
                      id={`tabela-preco-${row.id}`}
                      name=""
                      onValueChange={(value) => updateRow(row.id, "valor", value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      aria-label={`Remover linha ${index + 1}`}
                      onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
          Nenhuma linha adicionada. A tabela de preço é opcional.
        </div>
      )}
      <Button onClick={addRow} type="button" variant="secondary">
        <PlusIcon /> Adicionar linha
      </Button>
    </div>
  );
}
