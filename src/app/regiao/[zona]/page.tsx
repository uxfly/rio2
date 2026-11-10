import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LancamentosCatalogo from "@/components/LancamentosCatalogo";
import { getAdminBairros } from "@/lib/admin-bairros-store";
import { getPublishedProperties } from "@/lib/admin-imoveis-store";
import { slugificarImovel } from "@/lib/imoveis";
import { toCatalogProperty } from "@/lib/published-imoveis";
import type { RegiaoDoRio } from "@/lib/regioes";

type Props = { params: Promise<{ zona: string }> };

const REGIOES: Record<string, { nome: string; admin: RegiaoDoRio }> = {
  "barra-e-recreio": { nome: "Barra e Recreio", admin: "Zona Oeste" },
  "zona-oeste": { nome: "Zona Oeste", admin: "Zona Oeste" },
  "zona-sul": { nome: "Zona Sul", admin: "Zona Sul" },
  "zona-norte": { nome: "Zona Norte", admin: "Zona Norte" },
  "grande-tijuca": { nome: "Grande Tijuca", admin: "Zona Norte" },
  centro: { nome: "Centro", admin: "Centro" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zona } = await params;
  const regiao = REGIOES[zona];
  return regiao ? {
    title: `Imóveis na ${regiao.nome} do Rio de Janeiro | Rio Lançamentos`,
    description: `Conheça imóveis selecionados na ${regiao.nome} do Rio de Janeiro.`,
  } : {};
}

export default async function RegiaoPage({ params }: Props) {
  const { zona } = await params;
  const regiao = REGIOES[zona];
  if (!regiao) notFound();

  const [bairros, properties] = await Promise.all([getAdminBairros(), getPublishedProperties()]);
  const slugsDosBairros = new Set(
    bairros
      .filter((bairro) => bairro.status === "Publicado" && bairro.regiao === regiao.admin)
      .map((bairro) => slugificarImovel(bairro.nome)),
  );
  const items = properties
    .filter((property) => slugsDosBairros.has(slugificarImovel(property.bairro)))
    .map(toCatalogProperty);

  return <LancamentosCatalogo items={items} />;
}
