"use client";

import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  imoveis: "Imóveis",
  refugios: "Refúgios",
  posts: "Posts",
  leads: "Leads",
  contatos: "Forms",
};

export function AdminSectionTitle() {
  const section = usePathname().split("/").filter(Boolean)[1];
  return (
    <h1 className="text-sm font-medium sm:text-base">
      {labels[section] ?? "Visão geral"}
    </h1>
  );
}
