import { createAdminClient } from "@/lib/supabase/admin";
import { ExperienceManager } from "@/components/admin/experience-manager";

export default async function AdminExperiencePage() {
  const admin = createAdminClient();
  const { data: items } = await admin
    .from("experiences")
    .select("*")
    .order("sort_order")
    .order("start_date", { ascending: false });

  const rows = ((items ?? []) as Record<string, unknown>[]).map((e) => ({
    id: String(e.id),
    company: (e.company as string) ?? "",
    position: (e.position as string) ?? "",
    start_date: (e.start_date as string) ?? "",
    end_date: (e.end_date as string) ?? "",
    is_current: (e.is_current as boolean) ?? false,
    description: (e.description as string) ?? "",
    technologies: ((e.technologies as string[]) ?? []).join(", "),
    sort_order: (e.sort_order as number) ?? 0,
  }));

  return <ExperienceManager items={rows} />;
}
