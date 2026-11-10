import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import {
  encontrarImovel,
  IMOVEIS_DETALHES,
} from "@/lib/imoveis";
import { getPublishedDetails } from "@/lib/published-imoveis";
import { urlDoImovel } from "@/lib/site-urls";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return IMOVEIS_DETALHES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const published = await getPublishedDetails();
  const imovel = published.find((item) => item.slug === slug) ?? encontrarImovel(slug);
  const title = `${imovel.nome} em ${imovel.bairro} | Rio Imóveis`;
  const description = `${imovel.tipologia}. ${imovel.descricao}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imovel.imagem, alt: imovel.alt }],
      locale: "pt_BR",
      type: "website",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const published = await getPublishedDetails();
  const imovel = published.find((item) => item.slug === slug) ?? encontrarImovel(slug);
  permanentRedirect(urlDoImovel(imovel));
}
