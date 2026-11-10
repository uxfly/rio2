import { notFound } from "next/navigation";
import { ImovelForm } from "@/components/admin/imovel-form";
import { getAdminMasterName } from "@/lib/admin-auth";
import { getAdminImovelDrafts } from "@/lib/admin-imoveis-store";
import { toImovelFormValues } from "@/lib/admin-imovel-form-values";
import { getAdminIncorporadores } from "@/lib/admin-incorporadores-store";
import { Badge } from "@/components/ui/badge";

export default async function EditarImovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drafts = await getAdminImovelDrafts();
  const incorporadoras = (await getAdminIncorporadores()).map((item) => item.nome);
  const draft = drafts.find(
    (item) => item.segmento === "imovel" && (item.id === id || item.sourceId === id),
  );
  if (!draft) notFound();

  const values = toImovelFormValues(draft);
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <header>
        <p className="text-sm text-muted-foreground">Imóveis</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{draft.nome}</h2>
          <Badge variant={draft.categoria === "Alto padrão" ? "default" : "secondary"}>{draft.categoria}</Badge>
        </div>
      </header>
      <ImovelForm
        editId={id}
        incorporadoras={incorporadoras}
        publication={{
          author: draft.author || getAdminMasterName(),
          publishedAt: draft.publishedAt,
          updatedAt: draft.updatedAt,
        }}
        values={values}
      />
    </div>
  );
}
