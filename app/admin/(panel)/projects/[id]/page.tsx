import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProjectEditor } from "@/components/admin/project-editor";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const [{ data: project }, { data: technologies }, { data: links }] = await Promise.all([
    admin.from("projects").select("*").eq("id", id).single(),
    admin.from("technologies").select("id, name, category").order("name"),
    admin.from("project_technologies").select("technology_id").eq("project_id", id),
  ]);
  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="font-mono text-sm font-bold hover:underline">
        ← BACK TO PROJECTS
      </Link>
      <h1 className="mt-2 text-4xl font-bold uppercase">Edit project</h1>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6">
        <ProjectEditor
          id={project.id}
          technologies={technologies ?? []}
          initial={{
            title: project.title ?? "",
            slug: project.slug ?? "",
            tagline: project.tagline ?? "",
            description: project.description ?? "",
            overview: project.overview ?? "",
            problem: project.problem ?? "",
            solution: project.solution ?? "",
            architecture: project.architecture ?? "",
            challenges: project.challenges ?? "",
            lessons: project.lessons ?? "",
            hero_image_url: project.hero_image_url ?? "",
            github_url: project.github_url ?? "",
            live_url: project.live_url ?? "",
            featured: project.featured ?? false,
            status: project.status ?? "draft",
            sort_order: project.sort_order ?? 0,
            technology_ids: (links ?? []).map((l) => l.technology_id),
          }}
        />
      </div>
    </div>
  );
}
