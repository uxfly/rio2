import { cookies } from "next/headers";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();
  const cookieStore = await cookies();
  const defaultSidebarOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== "false";

  return (
    <AdminShell
      defaultSidebarOpen={defaultSidebarOpen}
      email={session.email}
      name={session.name}
      role={session.role}
    >
      {children}
    </AdminShell>
  );
}
