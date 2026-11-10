import { AccessForm } from "@/components/admin/access-form";
import { requireAdminMaster } from "@/lib/admin-auth";

export default async function NewAccessPage() {
  await requireAdminMaster();
  return <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8"><header><p className="text-sm text-muted-foreground">Acessos</p><h2 className="mt-1 text-3xl font-semibold">Novo acesso</h2></header><AccessForm /></div>;
}
