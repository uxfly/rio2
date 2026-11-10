import { notFound } from "next/navigation";
import { ImovelForm } from "@/components/admin/imovel-form";
import { getAdminMasterName } from "@/lib/admin-auth";
import { getAdminImovelDrafts } from "@/lib/admin-imoveis-store";
import { toImovelFormValues } from "@/lib/admin-imovel-form-values";
import { getAdminIncorporadores } from "@/lib/admin-incorporadores-store";

export default async function EditarRefugioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incorporadoras = (await getAdminIncorporadores()).map((item) => item.nome);
  const draft = (await getAdminImovelDrafts()).find(
    (item) => item.segmento === "refugio" && (item.id === id || item.sourceId === id),
  );
  if (!draft) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <header>
        <p className="text-sm text-muted-foreground">Refúgios</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{draft.nome}</h2>
      </header>
      <ImovelForm
        editId={id}
        incorporadoras={incorporadoras}
        publication={{
          author: draft.author || getAdminMasterName(),
          publishedAt: draft.publishedAt,
          updatedAt: draft.updatedAt,
        }}
        segmento="refugio"
        values={toImovelFormValues(draft)}
      />
    </div>
  );
}
