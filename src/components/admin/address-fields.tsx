"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircleIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type AddressValues = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  latitude: string;
  longitude: string;
};

type ViaCepResponse = {
  erro?: boolean;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

type MapTilerResponse = {
  features?: Array<{ geometry?: { coordinates?: [number, number] } }>;
};

export function AddressFields({ values }: { values?: AddressValues }) {
  const [address, setAddress] = useState<AddressValues>(values ?? {
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "Rio de Janeiro",
    latitude: "",
    longitude: "",
  });
  const [status, setStatus] = useState<"idle" | "cep" | "map">("idle");
  const [message, setMessage] = useState("");
  const numberRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    numberRef.current?.form?.dispatchEvent(new CustomEvent("property-fields-change"));
  }, [address]);

  function update(field: keyof AddressValues, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  async function geocode(nextAddress = address) {
    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const query = [
      nextAddress.logradouro,
      nextAddress.numero,
      nextAddress.bairro,
      nextAddress.cidade,
      "Rio de Janeiro",
      "Brasil",
    ].filter(Boolean).join(", ");

    if (!key || !nextAddress.logradouro || !nextAddress.cidade) {
      setMessage(key ? "Preencha logradouro e cidade." : "Chave do MapTiler não configurada.");
      return;
    }

    setStatus("map");
    setMessage("Buscando coordenadas…");
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${encodeURIComponent(key)}&country=br&language=pt&limit=1`,
      );
      if (!response.ok) throw new Error("MapTiler indisponível");
      const result = (await response.json()) as MapTilerResponse;
      const coordinates = result.features?.[0]?.geometry?.coordinates;
      if (!coordinates) throw new Error("Coordenadas não encontradas");
      setAddress((current) => ({
        ...current,
        latitude: String(coordinates[1]),
        longitude: String(coordinates[0]),
      }));
      setMessage("Coordenadas preenchidas pelo MapTiler.");
    } catch {
      setMessage("Não foi possível localizar esse endereço no MapTiler.");
    } finally {
      setStatus("idle");
    }
  }

  async function lookupCep() {
    const cep = address.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      setMessage("Digite um CEP com 8 números.");
      return;
    }

    setStatus("cep");
    setMessage("Buscando CEP…");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("ViaCEP indisponível");
      const result = (await response.json()) as ViaCepResponse;
      if (result.erro) throw new Error("CEP não encontrado");
      const nextAddress = {
        ...address,
        cep: cep.replace(/(\d{5})(\d{3})/, "$1-$2"),
        logradouro: result.logradouro ?? "",
        complemento: address.complemento || result.complemento || "",
        bairro: result.bairro ?? "",
        cidade: result.localidade ?? "",
      };
      setAddress(nextAddress);
      setMessage("Endereço preenchido. Informe o número.");
      requestAnimationFrame(() => numberRef.current?.focus());
      await geocode(nextAddress);
    } catch {
      setMessage("CEP não encontrado. Confira e tente novamente.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="cep">CEP</FieldLabel>
        <Input
          id="cep"
          inputMode="numeric"
          maxLength={9}
          name="cep"
          onBlur={lookupCep}
          onChange={(event) => update("cep", event.target.value)}
          value={address.cep}
        />
      </Field>
      <div className="hidden md:block" />

      <Field className="md:col-span-2">
        <FieldLabel htmlFor="logradouro">Logradouro</FieldLabel>
        <Input id="logradouro" name="logradouro" onChange={(event) => update("logradouro", event.target.value)} value={address.logradouro} />
      </Field>
      <Field>
        <FieldLabel htmlFor="numero">Número</FieldLabel>
        <Input
          id="numero"
          name="numero"
          onBlur={() => void geocode()}
          onChange={(event) => update("numero", event.target.value)}
          ref={numberRef}
          value={address.numero}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="complemento">Complemento</FieldLabel>
        <Input id="complemento" name="complemento" onChange={(event) => update("complemento", event.target.value)} value={address.complemento} />
      </Field>
      <Field>
        <FieldLabel htmlFor="bairro">Bairro</FieldLabel>
        <Input id="bairro" name="bairro" onChange={(event) => update("bairro", event.target.value)} value={address.bairro} />
      </Field>
      <Field>
        <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
        <Input id="cidade" name="cidade" onChange={(event) => update("cidade", event.target.value)} value={address.cidade} />
      </Field>
      <Field>
        <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
        <Input id="latitude" name="latitude" onChange={(event) => update("latitude", event.target.value)} value={address.latitude} />
      </Field>
      <Field>
        <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
        <Input id="longitude" name="longitude" onChange={(event) => update("longitude", event.target.value)} value={address.longitude} />
      </Field>

      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <Button disabled={status !== "idle"} onClick={() => void geocode()} type="button" variant="secondary">
          {status !== "idle" ? <LoaderCircleIcon className="animate-spin" /> : <MapPinIcon />}
          Atualizar coordenadas
        </Button>
        {message ? <p className="text-xs text-muted-foreground" role="status">{message}</p> : null}
      </div>
    </div>
  );
}
