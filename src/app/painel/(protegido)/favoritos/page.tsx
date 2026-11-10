import type { Metadata } from "next";
import { FavoritesDialog } from "@/components/admin/favorites-dialog";
import { getFavoritePropertyIds } from "@/lib/admin-favorites-store";
import { getAdminImovelDrafts } from "@/lib/admin-imoveis-store";

export const metadata: Metadata = { title: "Favoritos | Painel Rio Lançamentos", robots: { index: false, follow: false } };

export default async function FavoritosPage() {
  const [properties, initialIds] = await Promise.all([
    getAdminImovelDrafts(),
    getFavoritePropertyIds(),
  ]);
  const options = properties.map(({ id, nome, bairro, segmento }) => ({ id, nome, bairro, segmento }));
  return <FavoritesDialog initialIds={initialIds} options={options} />;
}
