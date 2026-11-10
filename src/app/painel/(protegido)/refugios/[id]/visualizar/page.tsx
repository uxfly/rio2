import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminImovelDrafts } from "@/lib/admin-imoveis-store";

export default async function VisualizarRefugioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = (await getAdminImovelDrafts()).find(
    (draft) => draft.segmento === "refugio" && (draft.id === id || draft.sourceId === id),
  );
  if (!item) notFound();
  const cover = item.galeria[0];

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost"><Link href="/painel/refugios"><ArrowLeftIcon /> Voltar</Link></Button>
        <Button asChild><Link href={`/painel/refugios/${id}/editar`}><PencilIcon /> Editar</Link></Button>
      </div>
      <Card>
        {cover ? (
          <div className="relative aspect-[21/7] min-h-52 overflow-hidden">
            <Image alt={item.nome} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 1200px" src={cover} />
          </div>
        ) : null}
        <CardHeader>
          <div className="mb-2 flex gap-2"><Badge>{item.status}</Badge></div>
          <CardTitle className="text-2xl">{item.nome}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Info label="Bairro" value={item.bairro} />
            <Info label="Tipologia" value={item.tipologia} />
            <Info label="Metragem" value={`${item.metragem} m²`} />
            <Info label="Terreno" value={item.terreno ? `${item.terreno} m²` : "Não informado"} />
            <Info label="Valor" value={item.valor} />
            <Info label="Incorporadora" value={item.incorporadora} />
          </div>
          <div className="space-y-4">
            <Info label="Endereço" value={item.endereco} />
            <Info label="Descrição" value={item.descricao} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-sm leading-relaxed">{value}</p></div>;
}
