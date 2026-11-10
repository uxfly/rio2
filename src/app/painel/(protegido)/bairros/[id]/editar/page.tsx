import { notFound } from "next/navigation";
import { BairroForm } from "@/components/admin/bairro-form";
import { getAdminBairros } from "@/lib/admin-bairros-store";

export default async function EditarBairroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bairro = (await getAdminBairros()).find((item) => item.id === id);
  if (!bairro) notFound();
  return <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8"><header><p className="text-sm text-muted-foreground">Bairros</p><h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Editar {bairro.nome}</h2></header><BairroForm editId={id} publication={{ author: bairro.author, publishedAt: bairro.publishedAt, updatedAt: bairro.updatedAt }} values={bairro} /></div>;
}
