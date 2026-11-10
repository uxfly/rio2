import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const modules: Record<string, string> = {
  refugios: "Refúgios",
  posts: "Posts",
  favoritos: "Favoritos",
  leads: "Leads",
  contatos: "Forms",
};

export default async function FutureModulePage({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = await params;
  const title = modules[modulo];
  if (!title) notFound();

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Este módulo será montado depois do fluxo de imóveis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/painel/imoveis">Continuar em Imóveis <ArrowRightIcon /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
