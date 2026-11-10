import type { Metadata } from "next";
import RefugiosCatalogo from "@/components/RefugiosCatalogo";
import { getPublishedRefuges } from "@/lib/published-imoveis";

export const metadata: Metadata = {
  title: "Casas e refúgios exclusivos no Rio de Janeiro — Rio Imóveis",
  description:
    "Conheça cinco propriedades reservadas no Rio de Janeiro, selecionadas por privacidade, natureza, arquitetura e paisagem.",
};

export default async function Page() {
  return <RefugiosCatalogo items={await getPublishedRefuges()} />;
}
