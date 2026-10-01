import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProjectEditor } from "@/components/admin/project-editor";

export default async function NewProjectPage() {
  const admin = createAdminClient();
  const { data: technologies } = await admin
    .from("technologies")
    .select("id, name, category")
    .order("name");

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="font-mono text-sm font-bold hover:underline">
        ← BACK TO PROJECTS
      </Link>
      <h1 className="mt-2 text-4xl font-bold uppercase">New project</h1>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6">
        <ProjectEditor technologies={technologies ?? []} />
      </div>
    </div>
  );
}
