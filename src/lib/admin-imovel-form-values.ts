import "server-only";

import type { ImovelFormValues } from "@/components/admin/imovel-form";
import type { AdminImovelDraft } from "@/lib/admin-imoveis-store";
import type { ImovelDetalhe } from "@/lib/imoveis";

function choice(value: string | undefined) {
  const match = value?.match(/\d+/)?.[0];
  if (!match) return "";
  const number = Number(match);
  return number >= 5 ? "5+" : String(Math.max(1, number));
}

function area(value: string) {
  return value.match(/[\d.]+/)?.[0] ?? "";
}

function propertyType(value: string) {
  const normalized = value.toLocaleLowerCase("pt-BR");
  if (normalized.includes("casa")) return "Casa";
  if (normalized.includes("garden")) return "Garden";
  if (normalized.includes("studio")) return "Studio";
  if (normalized.includes("apartamento")) return "Apartamento";
  return "";
}

export function toImovelFormValues(
  item: AdminImovelDraft | ImovelDetalhe,
): ImovelFormValues {
  if ("quartos" in item) {
    return {
      nome: item.nome,
      slug: item.slug,
      categoria: item.categoria,
      segmento: item.segmento,
      incorporadora: item.incorporadora === "Não definida" ? "" : item.incorporadora,
      tipoImovel: item.tipoImovel ?? "",
      quartos: item.quartos,
      garagem: item.garagem,
      banheiros: item.banheiros,
      suites: item.suites ?? "",
      metragem: item.metragem,
      terreno: item.terreno,
      cep: item.cep,
      logradouro: item.logradouro,
      numero: item.numero,
      complemento: item.complemento,
      bairro: item.bairro,
      cidade: item.cidade,
      latitude: item.latitude,
      longitude: item.longitude,
      chamada: item.chamada,
      descricao: item.descricao,
      valor: item.valor,
      tabelaPreco: item.tabelaPreco,
      galeria: item.galeria,
      plantas: item.plantas,
    };
  }

  return {
    nome: item.nome,
    slug: item.slug,
    categoria: item.categoria,
    segmento: "imovel",
    incorporadora: item.incorporadora,
    tipoImovel: propertyType(item.tipologia),
    quartos: choice(item.configuracao || item.tipologia),
    garagem: choice(item.vagas),
    banheiros: choice(item.configuracao || item.tipologia),
    suites: choice(item.configuracao || item.tipologia),
    metragem: area(item.area),
    terreno: "",
    cep: "",
    logradouro: item.endereco,
    numero: "",
    complemento: "",
    bairro: item.bairro,
    cidade: "Rio de Janeiro",
    latitude: "",
    longitude: "",
    chamada: item.chamada,
    descricao: item.descricao,
    valor: item.valor,
    tabelaPreco: "",
    galeria: [...item.galeria],
    plantas: item.plantas.map((planta) => planta.imagem),
  };
}
