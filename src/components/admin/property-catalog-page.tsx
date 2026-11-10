import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, MoreHorizontalIcon, PencilIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminImovelDrafts } from "@/lib/admin-imoveis-store";

type CatalogSearchParams = { page?: string; criado?: string; atualizado?: string };

export async function PropertyCatalogPage({
  segmento,
  searchParams,
}: {
  segmento: "imovel" | "refugio";
  searchParams: Promise<CatalogSearchParams>;
}) {
  const { page: pageParam = "1", criado, atualizado } = await searchParams;
  const drafts = (await getAdminImovelDrafts()).filter((item) => item.segmento === segmento);
  const isRefuge = segmento === "refugio";
  const section = isRefuge ? "refugios" : "imoveis";
  const singular = isRefuge ? "Refúgio" : "Imóvel";
  const plural = isRefuge ? "Refúgios" : "Imóveis";
  const pageSize = 10;
  const totalItems = drafts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const requestedPage = Number.parseInt(pageParam, 10);
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleDrafts = drafts.slice(startIndex, startIndex + pageSize);
  const visibleEnd = Math.min(startIndex + pageSize, totalItems);

  const confirmation = (status: string) =>
    status === "publicado" ? "publicado" : "salvo como rascunho";

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Catálogo</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{plural}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{totalItems} registros encontrados</p>
        </div>
        <Button asChild>
          <Link href={`/painel/${section}/novo`}><PlusIcon /> Novo {singular.toLocaleLowerCase("pt-BR")}</Link>
        </Button>
      </header>

      {criado ? (
        <p className="rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">
          {singular} {confirmation(criado)} com sucesso.
        </p>
      ) : null}
      {atualizado ? (
        <p className="rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">
          {singular} {confirmation(atualizado)} com sucesso.
        </p>
      ) : null}

      <Card>
        <CardContent className="space-y-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Capa</TableHead>
                <TableHead>{singular}</TableHead>
                <TableHead>Bairro</TableHead>
                {!isRefuge ? <TableHead>Categoria</TableHead> : null}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleDrafts.map((item) => {
                const editHref = `/painel/${section}/${item.id}/editar`;
                return (
                  <TableRow className="cursor-pointer" key={item.id}>
                    <TableCell className="p-0">
                      <Link className="block p-2" href={editHref} aria-label={`Editar ${item.nome}`}>
                        <span className="relative block h-14 w-20 overflow-hidden rounded-lg border border-border bg-muted">
                          <Image
                            alt={`Capa de ${item.nome}`}
                            className="object-cover"
                            fill
                            sizes="80px"
                            src={item.galeria[0] || "/img/cover.webp"}
                          />
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link className="block p-2" href={editHref}>
                        <div className="font-medium">{item.nome}</div>
                        <div className="max-w-72 truncate text-xs text-muted-foreground">{item.tipologia}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="p-0"><Link className="block p-2" href={editHref}>{item.bairro}</Link></TableCell>
                    {!isRefuge ? <TableCell className="p-0"><Link className="block p-2" href={editHref}>{item.categoria}</Link></TableCell> : null}
                    <TableCell className="p-0"><Link className="block p-2" href={editHref}><Badge variant={item.status === "Publicado" ? "default" : "secondary"}>{item.status}</Badge></Link></TableCell>
                    <TableCell className="relative z-10 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-label={`Ações de ${item.nome}`} size="icon" variant="ghost"><MoreHorizontalIcon /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="admin-theme dark">
                          <DropdownMenuItem asChild><Link href={`/painel/${section}/${item.id}/visualizar`}><EyeIcon /> Visualizar</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href={editHref}><PencilIcon /> Editar</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}

              {totalItems === 0 ? (
                <TableRow><TableCell className="h-28 text-center text-muted-foreground" colSpan={isRefuge ? 5 : 6}>Nenhum {singular.toLocaleLowerCase("pt-BR")} encontrado.</TableCell></TableRow>
              ) : null}
            </TableBody>
          </Table>

          {totalItems > 0 ? (
            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Exibindo {startIndex + 1}–{visibleEnd} de {totalItems}</p>
              <nav aria-label={`Paginação de ${plural.toLocaleLowerCase("pt-BR")}`} className="flex flex-wrap items-center gap-2">
                {currentPage > 1 ? (
                  <Button asChild variant="outline"><Link href={`/painel/${section}?page=${currentPage - 1}`}><ChevronLeftIcon /> Anterior</Link></Button>
                ) : <Button disabled variant="outline"><ChevronLeftIcon /> Anterior</Button>}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <Button asChild={page !== currentPage} className="size-10 px-0" key={page} variant={page === currentPage ? "default" : "outline"}>
                    {page === currentPage ? <span aria-current="page">{page}</span> : <Link href={`/painel/${section}?page=${page}`}>{page}</Link>}
                  </Button>
                ))}
                {currentPage < totalPages ? (
                  <Button asChild variant="outline"><Link href={`/painel/${section}?page=${currentPage + 1}`}>Próxima <ChevronRightIcon /></Link></Button>
                ) : <Button disabled variant="outline">Próxima <ChevronRightIcon /></Button>}
              </nav>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
