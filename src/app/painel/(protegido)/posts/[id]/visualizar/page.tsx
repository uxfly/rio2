import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminPosts } from "@/lib/admin-posts-store";

export default async function VisualizarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await getAdminPosts()).find((item) => item.id === id);
  if (!post) notFound();
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost"><Link href="/painel/posts"><ArrowLeftIcon /> Voltar</Link></Button>
        <Button asChild><Link href={`/painel/posts/${id}/editar`}><PencilIcon /> Editar</Link></Button>
      </div>
      <Card className="overflow-hidden">
        {post.imagemCapa ? <div className="relative aspect-[21/8] min-h-52"><Image alt={post.titulo} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 1200px" src={post.imagemCapa} /></div> : null}
        <CardHeader>
          <div className="mb-2 flex gap-2"><Badge>{post.status}</Badge><Badge variant="outline">{post.categoria}</Badge></div>
          <CardTitle className="text-3xl">{post.titulo}</CardTitle>
          <p className="text-base text-muted-foreground">{post.subtitulo}</p>
        </CardHeader>
        <CardContent><div className="prose prose-invert max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: post.texto }} /></CardContent>
      </Card>
    </div>
  );
}
