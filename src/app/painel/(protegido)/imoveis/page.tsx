import type { Metadata } from "next";
import { PropertyCatalogPage } from "@/components/admin/property-catalog-page";

export const metadata: Metadata = {
  title: "Imóveis | Painel Rio Lançamentos",
  robots: { index: false, follow: false },
};

export default function AdminImoveisPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; criado?: string; atualizado?: string }>;
}) {
  return <PropertyCatalogPage searchParams={searchParams} segmento="imovel" />;
}
