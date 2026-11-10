import { slugificarImovel } from "@/lib/imoveis";

type ImovelUrlData = {
  bairro: string;
  nome: string;
  slug?: string;
  segmento?: "imovel" | "refugio";
  tipoImovel?: string;
  tipologia?: string;
};

export function slugDoTipo(tipoImovel?: string, tipologia?: string) {
  if (tipoImovel) return slugificarImovel(tipoImovel);
  const texto = tipologia?.toLocaleLowerCase("pt-BR") ?? "";
  if (texto.includes("studio")) return "studio";
  if (texto.includes("garden")) return "garden";
  if (texto.includes("casa")) return "casa";
  if (texto.includes("cobertura")) return "cobertura";
  return "apartamento";
}

export function urlDoImovel(imovel: ImovelUrlData) {
  const bairro = slugificarImovel(imovel.bairro);
  const titulo = slugificarImovel(imovel.slug || imovel.nome);
  const tipo = imovel.segmento === "refugio"
    ? "refugio"
    : slugDoTipo(imovel.tipoImovel, imovel.tipologia);
  return `/rio-de-janeiro/${bairro}/${tipo}/${titulo}`;
}

export function urlDoBairro(nomeOuSlug: string) {
  return `/rio-de-janeiro/${slugificarImovel(nomeOuSlug)}`;
}

export function urlDaTipologia(nome: string) {
  return `/rio-de-janeiro/${slugDoTipo(nome)}`;
}
