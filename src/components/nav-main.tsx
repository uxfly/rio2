"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon?: React.ReactNode }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-4 py-0 group-data-[collapsible=icon]:px-1">
      <SidebarGroupLabel className="mb-3 h-10 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/55 group-data-[collapsible=icon]:mb-0">Menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={
                  pathname === item.url ||
                  (item.url !== "/painel" && pathname.startsWith(`${item.url}/`))
                }
                className="h-14 gap-4 rounded-xl border border-transparent px-3 text-base font-medium [&_svg]:size-5 data-active:border-sidebar-border data-active:bg-sidebar-accent data-active:shadow-sm group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:[&>span]:hidden"
                size="lg"
                tooltip={item.title}
              >
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
