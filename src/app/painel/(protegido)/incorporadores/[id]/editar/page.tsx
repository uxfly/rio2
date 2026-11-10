import { notFound } from "next/navigation";
import { IncorporadorForm } from "@/components/admin/incorporador-form";
import { getAdminIncorporadores } from "@/lib/admin-incorporadores-store";

export default async function EditarIncorporadorPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const item = (await getAdminIncorporadores()).find((entry) => entry.id === id); if (!item) notFound(); return <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8"><header><p className="text-sm text-muted-foreground">Incorporadores</p><h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Editar {item.nome}</h2></header><IncorporadorForm editId={id} publication={{ author: item.author, publishedAt: item.publishedAt, updatedAt: item.updatedAt }} values={item} /></div>; }
