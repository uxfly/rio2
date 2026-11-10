import type { Metadata } from "next";
import { BairroForm } from "@/components/admin/bairro-form";
import { getAdminMasterName } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Novo bairro | Painel Rio Lançamentos", robots: { index: false, follow: false } };

export default function NovoBairroPage() {
  return <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8"><header><p className="text-sm text-muted-foreground">Bairros</p><h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Cadastrar bairro</h2></header><BairroForm publication={{ author: getAdminMasterName() }} /></div>;
}
