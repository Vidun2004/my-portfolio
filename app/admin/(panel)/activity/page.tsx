import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminActivityPage() {
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("activity_log")
    .select("id, actor, action, entity, entity_id, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <p className="font-mono text-sm text-black/50">AUDIT TRAIL</p>
      <h1 className="text-4xl font-bold uppercase">Activity</h1>
      {!rows?.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">Nothing yet.</p>
          <p className="mt-2 font-mono text-sm text-black/50">Admin actions will show up here.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="border-ink bg-white shadow-brutal rounded-brutal-md flex flex-wrap items-center gap-x-3 gap-y-1 border-2 px-4 py-3">
              <span className="font-mono text-xs font-bold">{r.actor}</span>
              <span className="rounded-full border-2 border-ink bg-cream px-2 py-0.5 font-mono text-[11px] font-bold">
                {r.action}
              </span>
              {r.entity && <span className="font-mono text-xs text-black/50">{r.entity}</span>}
              <span className="ml-auto font-mono text-xs text-black/40">
                {new Date(r.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
