import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, MoreHorizontalIcon, PencilIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminPosts } from "@/lib/admin-posts-store";

export const metadata: Metadata = {
  title: "Posts | Painel Rio Lançamentos",
  robots: { index: false, follow: false },
};

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ page?: string; criado?: string; atualizado?: string }> }) {
  const { page: pageParam = "1", criado, atualizado } = await searchParams;
  const posts = await getAdminPosts();
  const pageSize = 10;
  const totalItems = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const requestedPage = Number.parseInt(pageParam, 10);
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visiblePosts = posts.slice(startIndex, startIndex + pageSize);
  const visibleEnd = Math.min(startIndex + pageSize, totalItems);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Conteúdo</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Posts</h2>
          <p className="mt-2 text-sm text-muted-foreground">{totalItems} registros encontrados</p>
        </div>
        <Button asChild><Link href="/painel/posts/novo"><PlusIcon /> Novo post</Link></Button>
      </header>

      {criado ? <Notice action="criado" status={criado} /> : null}
      {atualizado ? <Notice action="atualizado" status={atualizado} /> : null}

      <Card>
        <CardContent className="space-y-5">
          <Table>
            <TableHeader><TableRow><TableHead>Post</TableHead><TableHead>Categoria</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {visiblePosts.map((post) => {
                const editHref = `/painel/posts/${post.id}/editar`;
                return (
                  <TableRow className="cursor-pointer" key={post.id}>
                    <TableCell className="p-0">
                      <Link className="flex min-w-0 items-center gap-3 p-2" href={editHref}>
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                          {post.imagemCapa ? <Image alt="" className="object-cover" fill sizes="56px" src={post.imagemCapa} /> : null}
                        </div>
                        <div className="min-w-0"><div className="truncate font-medium">{post.titulo}</div><div className="max-w-xl truncate text-xs text-muted-foreground">{post.subtitulo}</div></div>
                      </Link>
                    </TableCell>
                    <TableCell className="p-0"><Link className="block p-2" href={editHref}>{post.categoria}</Link></TableCell>
                    <TableCell className="p-0"><Link className="block p-2" href={editHref}><Badge variant={post.status === "Publicado" ? "default" : "secondary"}>{post.status}</Badge></Link></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button aria-label={`Ações de ${post.titulo}`} size="icon" variant="ghost"><MoreHorizontalIcon /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="admin-theme dark">
                          <DropdownMenuItem asChild><Link href={`/painel/posts/${post.id}/visualizar`}><EyeIcon /> Visualizar</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href={editHref}><PencilIcon /> Editar</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!totalItems ? <TableRow><TableCell className="h-28 text-center text-muted-foreground" colSpan={4}>Nenhum post encontrado.</TableCell></TableRow> : null}
            </TableBody>
          </Table>

          {totalItems ? (
            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Exibindo {startIndex + 1}–{visibleEnd} de {totalItems}</p>
              <nav aria-label="Paginação de posts" className="flex flex-wrap items-center gap-2">
                {currentPage > 1 ? <Button asChild variant="outline"><Link href={`/painel/posts?page=${currentPage - 1}`}><ChevronLeftIcon /> Anterior</Link></Button> : <Button disabled variant="outline"><ChevronLeftIcon /> Anterior</Button>}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <Button asChild={page !== currentPage} className="size-10 px-0" key={page} variant={page === currentPage ? "default" : "outline"}>
                    {page === currentPage ? <span aria-current="page">{page}</span> : <Link href={`/painel/posts?page=${page}`}>{page}</Link>}
                  </Button>
                ))}
                {currentPage < totalPages ? <Button asChild variant="outline"><Link href={`/painel/posts?page=${currentPage + 1}`}>Próxima <ChevronRightIcon /></Link></Button> : <Button disabled variant="outline">Próxima <ChevronRightIcon /></Button>}
              </nav>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Notice({ action, status }: { action: "criado" | "atualizado"; status: string }) {
  return <p className="rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">Post {status === "publicado" ? "publicado" : "salvo como rascunho"} e {action} com sucesso.</p>;
}
