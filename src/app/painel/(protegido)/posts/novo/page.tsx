import type { Metadata } from "next";
import { PostForm } from "@/components/admin/post-form";
import { getAdminMasterName } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Novo post | Painel Rio Lançamentos", robots: { index: false, follow: false } };

export default function NovoPostPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <header><p className="text-sm text-muted-foreground">Posts</p><h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Criar post</h2></header>
      <PostForm publication={{ author: getAdminMasterName() }} />
    </div>
  );
}
