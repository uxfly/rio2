import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AdminShell({
  children,
  defaultSidebarOpen,
  email,
  name,
  role,
}: Readonly<{
  children: React.ReactNode;
  defaultSidebarOpen: boolean;
  email: string;
  name: string;
  role: "master" | "admin";
}>) {
  return (
    <main className="admin-theme dark min-h-svh bg-background text-foreground">
      <TooltipProvider>
        <SidebarProvider
          defaultOpen={defaultSidebarOpen}
          style={
            {
              "--sidebar-width": "19rem",
              "--sidebar-width-icon": "4.5rem",
              "--header-height": "3.5rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar email={email} name={name} role={role} variant="inset" />
          <SidebarInset className="bg-background">
            <SiteHeader />
            <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </main>
  );
}
