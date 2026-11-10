import Link from "next/link";
import { PencilIcon, PlusIcon } from "lucide-react";
import { requireAdminMaster } from "@/lib/admin-auth";
import { getAdminAccesses } from "@/lib/admin-access-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AccessesPage({ searchParams }: { searchParams: Promise<{ criado?: string; atualizado?: string }> }) {
  await requireAdminMaster();
  const [items, query] = await Promise.all([getAdminAccesses(), searchParams]);
  return <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
    <header className="flex items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">Administração</p><h2 className="mt-1 text-3xl font-semibold">Acessos</h2><p className="mt-2 text-sm text-muted-foreground">{items.length} usuários autorizados</p></div><Button asChild><Link href="/painel/acessos/novo"><PlusIcon /> Novo acesso</Link></Button></header>
    {query.criado || query.atualizado ? <p className="rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">Acesso salvo com sucesso.</p> : null}
    <Card><CardContent><Table><TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>Perfil</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{items.map((item) => <TableRow key={item.id}><TableCell><div className="font-medium">{item.name}</div><div className="text-xs text-muted-foreground">{item.email}</div></TableCell><TableCell><Badge variant="outline">{item.role === "master" ? "Admin master" : "Administrador"}</Badge></TableCell><TableCell><Badge variant={item.active ? "default" : "secondary"}>{item.active ? "Ativo" : "Inativo"}</Badge></TableCell><TableCell className="text-right"><Button asChild size="sm" variant="ghost"><Link href={`/painel/acessos/${item.id}/editar`}><PencilIcon /> Editar</Link></Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
  </div>;
}
