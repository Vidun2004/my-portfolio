import { createAdminClient } from "@/lib/supabase/admin";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export default async function AdminTestimonialsPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("testimonials")
    .select("id, name, role, quote, sort_order")
    .order("sort_order")
    .order("created_at");

  return (
    <TestimonialsManager
      testimonials={((data ?? []) as Record<string, unknown>[]).map((t) => ({
        id: String(t.id),
        name: (t.name as string) ?? "",
        role: (t.role as string) ?? "",
        quote: (t.quote as string) ?? "",
        sort_order: (t.sort_order as number) ?? 0,
      }))}
    />
  );
}
