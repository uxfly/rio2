import Link from "next/link";
import { ArrowUpRightIcon, Building2Icon, PlusIcon } from "lucide-react";
import { SectionCards } from "@/components/section-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminImovelDrafts } from "@/lib/admin-imoveis-store";

export default async function AdminDashboardPage() {
  const properties = await getAdminImovelDrafts();
  const recentItems = properties.slice(0, 3);
  const publishedCount = properties.filter((item) => item.status === "Publicado").length;
  return (
    <div className="flex flex-1 flex-col gap-6 py-5 md:py-7">
            <section className="flex flex-col gap-4 px-4 sm:flex-row sm:items-end sm:justify-between lg:px-6">
              <div>
                <p className="text-sm text-muted-foreground">Bem-vindo de volta</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Painel Rio Lançamentos</h2>
              </div>
              <Button asChild className="h-9 self-start">
                <Link href="/painel/imoveis/novo"><PlusIcon /> Novo imóvel</Link>
              </Button>
            </section>

            <SectionCards propertyCount={publishedCount} />

            <section className="grid gap-4 px-4 lg:grid-cols-[1.7fr_1fr] lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Imóveis recentes</CardTitle>
                  <CardDescription>Últimos itens adicionados ao catálogo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {recentItems.map((item) => (
                    <div className="flex items-center gap-3 border-b py-3 last:border-0" key={item.id}>
                      <span className="flex size-9 items-center justify-center rounded-lg bg-muted"><Building2Icon className="size-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.nome}</p>
                        <p className="text-xs text-muted-foreground">{item.bairro}</p>
                      </div>
                      <Badge>{item.status}</Badge>
                    </div>
                  ))}
                  {recentItems.length === 0 ? (
                    <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 text-center">
                      <Building2Icon className="size-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Nenhum imóvel cadastrado.</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações rápidas</CardTitle>
                  <CardDescription>Atalhos para as rotinas do dia.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button asChild variant="outline" className="h-11 justify-start">
                    <Link href="/painel/imoveis/novo"><PlusIcon /> Cadastrar imóvel <ArrowUpRightIcon className="ml-auto" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 justify-start">
                    <Link href="/painel/imoveis"><Building2Icon /> Gerenciar imóveis <ArrowUpRightIcon className="ml-auto" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 justify-start">
                    <Link href="/lancamentos" target="_blank"><Building2Icon /> Abrir catálogo <ArrowUpRightIcon className="ml-auto" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </section>
    </div>
  );
}
