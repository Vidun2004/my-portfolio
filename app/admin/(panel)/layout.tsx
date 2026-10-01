import { requireAdmin } from "@/lib/supabase/require-admin";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <div className="bg-cream text-ink flex min-h-screen flex-col md:flex-row">
      <AdminSidebar email={user.email} />
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
