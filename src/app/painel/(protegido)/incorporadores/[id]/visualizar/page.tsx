import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminIncorporadores } from "@/lib/admin-incorporadores-store";

export default async function VisualizarIncorporadorPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const item = (await getAdminIncorporadores()).find((entry) => entry.id === id); if (!item) notFound(); return <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8"><div className="flex items-center justify-between gap-3"><Button asChild variant="ghost"><Link href="/painel/incorporadores"><ArrowLeftIcon /> Voltar</Link></Button><Button asChild><Link href={`/painel/incorporadores/${id}/editar`}><PencilIcon /> Editar</Link></Button></div><Card><CardHeader><div className="mb-2"><Badge>{item.status}</Badge></div><CardTitle className="text-3xl">{item.nome}</CardTitle></CardHeader><CardContent><p className="max-w-4xl whitespace-pre-wrap leading-relaxed text-muted-foreground">{item.descricao}</p></CardContent></Card></div>; }
