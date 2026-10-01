import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { SkillEditor } from "@/components/admin/skill-editor";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: s } = await createAdminClient().from("technologies").select("*").eq("id", id).single();
  if (!s) notFound();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/skills" className="font-mono text-sm font-bold hover:underline">← BACK TO SKILLS</Link>
      <h1 className="mt-2 text-4xl font-bold uppercase">Edit skill</h1>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6">
        <SkillEditor
          id={s.id}
          initial={{
            name: s.name ?? "",
            category: s.category ?? "languages",
            description: s.description ?? "",
            level: s.level ?? 50,
            featured: s.featured ?? false,
            sort_order: s.sort_order ?? 0,
          }}
        />
      </div>
    </div>
  );
}
