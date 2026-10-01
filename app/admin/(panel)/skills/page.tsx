import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteSkill } from "@/app/actions/admin-skills";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminSkillsPage() {
  const admin = createAdminClient();
  const { data: skills } = await admin
    .from("technologies")
    .select("id, name, category, level")
    .order("sort_order")
    .order("name");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-black/50">MANAGE</p>
          <h1 className="text-4xl font-bold uppercase">Skills</h1>
        </div>
        <Link href="/admin/skills/new">
          <Button className="font-mono">+ NEW SKILL</Button>
        </Link>
      </div>
      {!skills?.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No skills yet.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">SKILL</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">LEVEL</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">{s.name}</td>
                  <td className="px-4 py-3 font-mono text-xs uppercase">{s.category}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.level}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/skills/${s.id}`} className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs font-bold hover:-translate-y-0.5">
                        EDIT
                      </Link>
                      <DeleteButton label={s.name} onDelete={deleteSkill.bind(null, s.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
