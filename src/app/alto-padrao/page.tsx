import type { Metadata } from "next";
import LancamentosCatalogo from "@/components/LancamentosCatalogo";
import { getPublishedCatalog } from "@/lib/published-imoveis";

export const metadata: Metadata = {
  title: "Imóveis de alto padrão no Rio de Janeiro — Rio Imóveis",
  description:
    "Explore casas, apartamentos, gardens e coberturas acima de R$ 5 milhões nos endereços mais exclusivos do Rio de Janeiro.",
};

export default async function Page() {
  const properties = (await getPublishedCatalog()).filter((item) => item.categoria === "Alto padrão");
  return <LancamentosCatalogo items={properties} variante="alto-padrao" key="alto-padrao" />;
}
