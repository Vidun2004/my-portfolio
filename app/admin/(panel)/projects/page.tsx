import { createAdminClient } from "@/lib/supabase/admin";
import { ProjectsManager } from "@/components/admin/projects-manager";

export default async function AdminProjectsPage() {
  const admin = createAdminClient();
  const [{ data: projects }, { data: technologies }, { data: links }] = await Promise.all([
    admin.from("projects").select("*").order("sort_order").order("created_at", { ascending: false }),
    admin.from("technologies").select("id, name, category").order("name"),
    admin.from("project_technologies").select("project_id, technology_id"),
  ]);

  const techByProject = new Map<string, string[]>();
  for (const l of (links ?? []) as { project_id: string; technology_id: string }[]) {
    const arr = techByProject.get(l.project_id) ?? [];
    arr.push(l.technology_id);
    techByProject.set(l.project_id, arr);
  }

  const rows = ((projects ?? []) as Record<string, unknown>[]).map((p) => ({
    id: String(p.id),
    title: (p.title as string) ?? "",
    slug: (p.slug as string) ?? "",
    tagline: (p.tagline as string) ?? "",
    description: (p.description as string) ?? "",
    overview: (p.overview as string) ?? "",
    problem: (p.problem as string) ?? "",
    solution: (p.solution as string) ?? "",
    architecture: (p.architecture as string) ?? "",
    challenges: (p.challenges as string) ?? "",
    lessons: (p.lessons as string) ?? "",
    features_raw: ((p.features as string[]) ?? []).join("\n"),
    hero_image_url: (p.hero_image_url as string) ?? "",
    gallery_urls_raw: ((p.gallery_urls as string[]) ?? []).join("\n"),
    github_url: (p.github_url as string) ?? "",
    live_url: (p.live_url as string) ?? "",
    featured: (p.featured as boolean) ?? false,
    status: (p.status as string) ?? "draft",
    sort_order: (p.sort_order as number) ?? 0,
    technology_ids: techByProject.get(String(p.id)) ?? [],
    updated_at: (p.updated_at as string) ?? "",
  }));

  return <ProjectsManager projects={rows} technologies={technologies ?? []} />;
}
