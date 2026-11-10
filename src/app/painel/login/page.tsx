import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Acesso ao painel | Rio Lançamentos",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/painel");

  return (
    <main className="admin-theme dark relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-5 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,97,50,0.24),transparent_36%),radial-gradient(circle_at_80%_85%,rgba(255,255,255,0.08),transparent_32%)]" />
      <div className="relative z-10 flex w-full flex-col items-center gap-7">
        <div className="text-center text-white">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">Rio Lançamentos</p>
          <p className="mt-2 text-sm text-white/75">Gestão de imóveis e oportunidades</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
