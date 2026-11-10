import type { Metadata } from "next";
import LancamentosCatalogo from "@/components/LancamentosCatalogo";
import { getPublishedCatalog } from "@/lib/published-imoveis";
import { slugificarImovel } from "@/lib/imoveis";

export const metadata: Metadata = {
  title: "Lançamentos imobiliários no Rio de Janeiro — Rio Imóveis",
  description:
    "Explore apartamentos, studios, gardens, coberturas e casas em lançamento nos bairros mais desejados do Rio de Janeiro.",
};

const TIPOLOGIAS = {
  apartamentos: "Apartamento",
  apartamento: "Apartamento",
  casas: "Casa",
  casa: "Casa",
  coberturas: "Cobertura",
  cobertura: "Cobertura",
  studios: "Studio",
  studio: "Studio",
  gardens: "Garden",
  garden: "Garden",
} as const;

const QUARTOS = new Set(["1", "2", "3", "4+"]);
const FAIXAS = new Set(["ate-2", "2-5", "acima-5"]);
const REGIOES = new Set(["centro", "zona-sul", "barra-recreio"]);

type SearchParams = Promise<{
  incorporadora?: string;
  tipo?: string;
  quartos?: string;
  bairro?: string;
  faixa?: string;
  regiao?: string;
}>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const { incorporadora, tipo, quartos, bairro, faixa, regiao } = await searchParams;
  const properties = (await getPublishedCatalog()).filter((item) =>
    incorporadora
      ? slugificarImovel(item.incorporadora ?? "") === slugificarImovel(incorporadora)
      : item.categoria === "Lançamento",
  );
  const tipologia = tipo
    ? TIPOLOGIAS[slugificarImovel(tipo) as keyof typeof TIPOLOGIAS]
    : undefined;
  const bairroSelecionado = bairro
    ? properties.find(
        (item) => slugificarImovel(item.bairro) === slugificarImovel(bairro),
      )?.bairro
    : undefined;
  const filtrosIniciais = {
    tipologia,
    quartos: quartos && QUARTOS.has(quartos) ? quartos : undefined,
    bairro: bairroSelecionado,
    faixa: faixa && FAIXAS.has(faixa) ? faixa : undefined,
    selecaoRapida: regiao && REGIOES.has(regiao) ? regiao : undefined,
  };
  const catalogKey = [tipo, quartos, bairro, faixa, regiao, incorporadora]
    .map((value) => value ?? "")
    .join("|");

  return (
    <LancamentosCatalogo
      initialFilters={filtrosIniciais}
      items={properties}
      key={catalogKey}
    />
  );
}
