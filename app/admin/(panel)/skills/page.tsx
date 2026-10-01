import { createAdminClient } from "@/lib/supabase/admin";
import { SkillsManager } from "@/components/admin/skills-manager";

export default async function AdminSkillsPage() {
  const admin = createAdminClient();
  const { data: skills } = await admin
    .from("technologies")
    .select("*")
    .order("sort_order")
    .order("name");

  const rows = ((skills ?? []) as Record<string, unknown>[]).map((s) => ({
    id: String(s.id),
    name: (s.name as string) ?? "",
    category: (s.category as string) ?? "languages",
    description: (s.description as string) ?? "",
    level: (s.level as number) ?? 50,
    featured: (s.featured as boolean) ?? false,
    sort_order: (s.sort_order as number) ?? 0,
  }));

  return <SkillsManager skills={rows} />;
}
