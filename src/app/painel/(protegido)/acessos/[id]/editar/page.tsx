import { notFound } from "next/navigation";
import { AccessForm } from "@/components/admin/access-form";
import { getAdminAccesses } from "@/lib/admin-access-store";
import { requireAdminMaster } from "@/lib/admin-auth";

export default async function EditAccessPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminMaster();
  const { id } = await params;
  const item = (await getAdminAccesses()).find((access) => access.id === id);
  if (!item) notFound();
  return <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8"><header><p className="text-sm text-muted-foreground">Acessos</p><h2 className="mt-1 text-3xl font-semibold">{item.name}</h2></header><AccessForm editId={id} values={item} /></div>;
}
