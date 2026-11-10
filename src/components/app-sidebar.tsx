"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2Icon,
  ContactRoundIcon,
  FileTextIcon,
  HardHatIcon,
  HeartIcon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  KeyRoundIcon,
  TreePalmIcon,
  UsersIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigation = [
  { title: "Visão geral", url: "/painel", icon: <LayoutDashboardIcon /> },
  { title: "Imóveis", url: "/painel/imoveis", icon: <Building2Icon /> },
  { title: "Bairros", url: "/painel/bairros", icon: <MapPinnedIcon /> },
  { title: "Refúgios", url: "/painel/refugios", icon: <TreePalmIcon /> },
  { title: "Favoritos", url: "/painel/favoritos", icon: <HeartIcon /> },
  { title: "Incorporadores", url: "/painel/incorporadores", icon: <HardHatIcon /> },
  { title: "Posts", url: "/painel/posts", icon: <FileTextIcon /> },
  { title: "Leads", url: "/painel/leads", icon: <UsersIcon /> },
  { title: "Forms", url: "/painel/contatos", icon: <ContactRoundIcon /> },
];

export function AppSidebar({
  email,
  name,
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & { email: string; name: string; role: "master" | "admin" }) {
  const items = role === "master"
    ? [...navigation, { title: "Acessos", url: "/painel/acessos", icon: <KeyRoundIcon /> }]
    : navigation;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-4 group-data-[collapsible=icon]:p-2">
        <Link
          className="flex min-h-16 items-center rounded-xl px-3 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:min-h-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2"
          href="/painel"
        >
          <Image alt="Rio Lançamentos" className="hidden h-auto w-11 object-contain group-data-[collapsible=icon]:block" height={19} src="/img/logo.svg" width={44} />
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-lg font-semibold tracking-tight">Rio Lançamentos</span>
            <span className="mt-1 block truncate text-sm text-muted-foreground">Administração</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-5">
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 group-data-[collapsible=icon]:p-1">
        <NavUser user={{ name, email }} />
      </SidebarFooter>
    </Sidebar>
  );
}
