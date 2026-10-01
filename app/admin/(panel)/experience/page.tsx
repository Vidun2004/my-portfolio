import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteExperience } from "@/app/actions/admin-experience";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminExperiencePage() {
  const admin = createAdminClient();
  const { data: items } = await admin
    .from("experiences")
    .select("id, position, company, start_date, is_current")
    .order("sort_order")
    .order("start_date", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-black/50">MANAGE</p>
          <h1 className="text-4xl font-bold uppercase">Experience</h1>
        </div>
        <Link href="/admin/experience/new">
          <Button className="font-mono">+ NEW ENTRY</Button>
        </Link>
      </div>
      {!items?.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No entries yet.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">POSITION</th>
                <th className="px-4 py-3">COMPANY</th>
                <th className="px-4 py-3">START</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">{e.position}</td>
                  <td className="px-4 py-3">{e.company || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{e.start_date ?? "—"}{e.is_current ? " → now" : ""}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/experience/${e.id}`} className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs font-bold hover:-translate-y-0.5">
                        EDIT
                      </Link>
                      <DeleteButton label={e.position} onDelete={deleteExperience.bind(null, e.id)} />
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
