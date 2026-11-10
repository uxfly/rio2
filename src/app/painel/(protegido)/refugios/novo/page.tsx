import type { Metadata } from "next";
import { ImovelForm } from "@/components/admin/imovel-form";
import { getAdminMasterName } from "@/lib/admin-auth";
import { getAdminIncorporadores } from "@/lib/admin-incorporadores-store";

export const metadata: Metadata = {
  title: "Novo refúgio | Painel Rio Lançamentos",
  robots: { index: false, follow: false },
};

export default async function NovoRefugioPage() {
  const incorporadoras = (await getAdminIncorporadores()).map((item) => item.nome);
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <header>
        <p className="text-sm text-muted-foreground">Refúgios</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Cadastrar refúgio</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Preencha as informações e escolha quando publicar.</p>
      </header>
      <ImovelForm incorporadoras={incorporadoras} publication={{ author: getAdminMasterName() }} segmento="refugio" />
    </div>
  );
}
