import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/toast";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const { count: unread } = await createAdminClient()
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <div className="bg-cream text-ink flex min-h-screen flex-col md:flex-row">
      <AdminSidebar email={user.email} unread={unread ?? 0} />
      <main className="mx-auto w-full max-w-6xl flex-1 p-6 md:p-10">{children}</main>
      <Toaster />
    </div>
  );
}
