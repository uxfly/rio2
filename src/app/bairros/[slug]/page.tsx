import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BairroProdutos from "@/components/BairroProdutos";
import {
  DESTINOS,
  encontrarDestino,
  imoveisPorDestino,
} from "@/lib/bairros";
import { IMOVEIS_DETALHES } from "@/lib/imoveis";

type BairroPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return DESTINOS.map((destino) => ({ slug: destino.slug }));
}

export async function generateMetadata({
  params,
}: BairroPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destino = encontrarDestino(slug);

  if (!destino) return {};

  return {
    title: `Imóveis em ${destino.nome}, Rio de Janeiro — Rio Imóveis`,
    description: `${destino.descricao} Conheça lançamentos e imóveis de alto padrão selecionados em ${destino.nome}.`,
  };
}

export default async function Page({ params }: BairroPageProps) {
  const { slug } = await params;
  const destino = encontrarDestino(slug);

  if (!destino) notFound();

  const imoveis =
    destino.tipo === "bairro"
      ? IMOVEIS_DETALHES.filter((imovel) => imovel.bairro === destino.nome)
      : imoveisPorDestino(destino);

  return (
    <BairroProdutos
      destino={destino}
      imoveis={imoveis}
    />
  );
}
