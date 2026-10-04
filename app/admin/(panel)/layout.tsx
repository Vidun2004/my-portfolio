import { Suspense } from "react";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { AdminSidebar } from "@/components/admin/sidebar";
import { UnreadBadge } from "@/components/admin/unread-badge";
import { Toaster } from "@/components/ui/toast";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="bg-cream text-ink flex min-h-screen flex-col md:flex-row">
      <AdminSidebar
        email={user.email}
        badge={
          <Suspense>
            <UnreadBadge />
          </Suspense>
        }
      />
      <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-10">{children}</main>
      <Toaster />
    </div>
  );
}
