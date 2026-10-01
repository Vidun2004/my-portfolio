import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";

export default async function AdminProjectsPage() {
  const admin = createAdminClient();
  const { data: projects } = await admin
    .from("projects")
    .select("id, title, slug, status, updated_at")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-black/50">MANAGE</p>
          <h1 className="text-4xl font-bold uppercase">Projects</h1>
        </div>
        <Link href="/admin/projects/new">
          <Button className="font-mono">+ NEW PROJECT</Button>
        </Link>
      </div>

      {!projects?.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No projects yet.</p>
          <p className="mt-2 font-mono text-sm text-black/50">The next one might be interesting.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">PROJECT</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">UPDATED</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border-2 border-ink bg-cream px-2 py-0.5 font-mono text-[11px] font-bold uppercase">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-black/50">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs font-bold hover:-translate-y-0.5"
                      >
                        EDIT
                      </Link>
                      <DeleteProjectButton id={p.id} title={p.title} />
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
