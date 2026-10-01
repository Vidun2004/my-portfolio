import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ExperienceEditor } from "@/components/admin/experience-editor";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: e } = await createAdminClient().from("experiences").select("*").eq("id", id).single();
  if (!e) notFound();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/experience" className="font-mono text-sm font-bold hover:underline">← BACK TO EXPERIENCE</Link>
      <h1 className="mt-2 text-4xl font-bold uppercase">Edit entry</h1>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6">
        <ExperienceEditor
          id={e.id}
          initial={{
            company: e.company ?? "",
            position: e.position ?? "",
            start_date: e.start_date ?? "",
            end_date: e.end_date ?? "",
            is_current: e.is_current ?? false,
            description: e.description ?? "",
            technologies: (e.technologies ?? []).join(", "),
            sort_order: e.sort_order ?? 0,
          }}
        />
      </div>
    </div>
  );
}
