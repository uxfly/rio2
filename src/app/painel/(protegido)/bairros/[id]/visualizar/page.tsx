import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminBairros } from "@/lib/admin-bairros-store";

export default async function VisualizarBairroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bairro = (await getAdminBairros()).find((item) => item.id === id);
  if (!bairro) notFound();
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex items-center justify-between gap-3"><Button asChild variant="ghost"><Link href="/painel/bairros"><ArrowLeftIcon /> Voltar</Link></Button><Button asChild><Link href={`/painel/bairros/${id}/editar`}><PencilIcon /> Editar</Link></Button></div>
      <Card className="overflow-hidden">
        <div className="relative aspect-[21/8] min-h-52"><Image alt={bairro.nome} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 1200px" src={bairro.imagem} /></div>
        <CardHeader><div className="mb-2 flex gap-2"><Badge>{bairro.status}</Badge><Badge variant="outline">{bairro.regiao}</Badge></div><CardTitle className="text-3xl">{bairro.nome}</CardTitle><p className="text-base text-muted-foreground">{bairro.textoCurto}</p></CardHeader>
        <CardContent><div className="prose prose-invert max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: bairro.texto }} /></CardContent>
      </Card>
    </div>
  );
}
