import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LancamentosCatalogo from "@/components/LancamentosCatalogo";
import { getAdminIncorporadores } from "@/lib/admin-incorporadores-store";
import { getPublishedCatalog } from "@/lib/published-imoveis";
import { slugificarImovel } from "@/lib/imoveis";

type Props = { params: Promise<{ slug: string }> };

async function getDeveloper(slug: string) {
  return (await getAdminIncorporadores()).find((item) => item.status === "Publicado" && item.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const item = await getDeveloper(slug);
  return item ? { title: `${item.nome} | Rio Lançamentos`, description: item.descricao } : {};
}

export default async function ConstrutoraPage({ params }: Props) {
  const { slug } = await params; const developer = await getDeveloper(slug);
  if (!developer) notFound();
  const items = (await getPublishedCatalog()).filter((item) => slugificarImovel(item.incorporadora ?? "") === slugificarImovel(developer.nome));
  return <LancamentosCatalogo items={items} />;
}
