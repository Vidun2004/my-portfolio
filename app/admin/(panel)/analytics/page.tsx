import { createAdminClient } from "@/lib/supabase/admin";

type View = {
  path: string;
  referrer: string;
  country: string;
  device: string;
  visitor_id: string | null;
  created_at: string;
};

type Evt = { type: string; target: string; visitor_id: string | null; created_at: string };

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function AdminAnalyticsPage() {
  const admin = createAdminClient();
  // eslint-disable-next-line react-hooks/purity -- server render: per-request window is intended
  const nowMs = Date.now();
  const since = new Date(nowMs - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: views }, { data: events }] = await Promise.all([
    admin
      .from("page_views")
      .select("path, referrer, country, device, visitor_id, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000),
    admin
      .from("events")
      .select("type, target, visitor_id, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(2000),
  ]);
  const vs = ((views ?? []) as View[]).slice().reverse();
  const es = ((events ?? []) as Evt[]);

  const weekAgo = nowMs - 7 * 24 * 60 * 60 * 1000;
  const views7 = vs.filter((v) => new Date(v.created_at).getTime() >= weekAgo);
  const uniques = new Set(vs.map((v) => v.visitor_id).filter(Boolean)).size;

  const byPage = new Map<string, number>();
  for (const v of vs) byPage.set(v.path, (byPage.get(v.path) ?? 0) + 1);
  const topPages = [...byPage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const byRef = new Map<string, number>();
  for (const v of vs) {
    if (!v.referrer) continue;
    let host = v.referrer;
    try {
      host = new URL(v.referrer).hostname.replace(/^www\./, "");
    } catch {
      /* keep raw */
    }
    byRef.set(host, (byRef.get(host) ?? 0) + 1);
  }
  const topRefs = [...byRef.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Daily buckets, last 14 days.
  const days: { key: string; label: string; n: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(nowMs - i * 24 * 60 * 60 * 1000);
    days.push({ key: dayKey(d), label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), n: 0 });
  }
  const dayIdx = new Map(days.map((d, i) => [d.key, i]));
  for (const v of vs) {
    const i = dayIdx.get(dayKey(new Date(v.created_at)));
    if (i !== undefined) days[i].n += 1;
  }
  const max = Math.max(1, ...days.map((d) => d.n));

  const byEvent = new Map<string, number>();
  for (const e of es) byEvent.set(e.type, (byEvent.get(e.type) ?? 0) + 1);
  const topEvents = [...byEvent.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Top journeys: visitors with 2+ views, ordered paths.
  const trails = new Map<string, { path: string; at: number }[]>();
  for (const v of vs) {
    if (!v.visitor_id) continue;
    const arr = trails.get(v.visitor_id) ?? [];
    arr.push({ path: v.path, at: new Date(v.created_at).getTime() });
    trails.set(v.visitor_id, arr);
  }
  const journeys = [...trails.entries()]
    .map(([id, stops]) => ({
      id: id.slice(0, 8),
      path: [...stops].sort((a, b) => a.at - b.at).map((s) => s.path),
    }))
    .filter((j) => new Set(j.path).size >= 2)
    .slice(0, 8);

  const recent = ((views ?? []) as View[]).slice(0, 15);

  return (
    <div>
      <p className="font-mono text-sm text-black/50">PRIVACY-FIRST · NO COOKIES NEEDED FOR VIEWS</p>
      <h1 className="text-4xl font-bold uppercase">Analytics</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "VIEWS · 30D", value: String(vs.length), color: "bg-brand-blue" },
          { label: "VIEWS · 7D", value: String(views7.length), color: "bg-brand-teal" },
          { label: "VISITORS · 30D", value: String(uniques), color: "bg-brand-yellow" },
          { label: "EVENTS · 30D", value: String(es.length), color: "bg-brand-pink" },
        ].map((c) => (
          <div key={c.label} className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-5">
            <p className="font-mono text-[11px] font-bold tracking-widest text-black/50">{c.label}</p>
            <p className="mt-1 flex items-center gap-2 text-3xl font-bold">
              <span className={`border-ink inline-block size-4 rounded border-2 ${c.color}`} />
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-5 md:p-6">
        <p className="font-mono text-xs font-bold">DAILY VIEWS · LAST 14 DAYS</p>
        <div className="mt-4 flex h-36 items-end gap-1.5">
          {days.map((d) => (
            <div key={d.key} title={`${d.label}: ${d.n}`} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="font-mono text-[10px] font-bold">{d.n > 0 ? d.n : ""}</span>
              <div
                className="border-ink w-full rounded-t border-2 border-b-0 bg-brand-yellow"
                style={{ height: `${Math.max(3, (d.n / max) * 100)}%` }}
              />
              <span className="font-mono text-[9px] text-black/40">{d.label.split(" ")[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-5">
          <p className="font-mono text-xs font-bold">TOP PAGES</p>
          <ul className="mt-3 space-y-2">
            {topPages.length === 0 && <li className="font-mono text-xs text-black/50">No views yet.</li>}
            {topPages.map(([p, n]) => (
              <li key={p} className="flex items-center justify-between gap-3 font-mono text-xs">
                <span className="truncate font-bold">{p}</span>
                <span className="border-ink shrink-0 rounded-full border-2 bg-cream px-2 py-0.5 font-bold">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-xs font-bold">TOP REFERRERS</p>
          <ul className="mt-3 space-y-2">
            {topRefs.length === 0 && <li className="font-mono text-xs text-black/50">Direct traffic so far.</li>}
            {topRefs.map(([r, n]) => (
              <li key={r} className="flex items-center justify-between gap-3 font-mono text-xs">
                <span className="truncate font-bold">{r}</span>
                <span className="border-ink shrink-0 rounded-full border-2 bg-cream px-2 py-0.5 font-bold">{n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-5">
          <p className="font-mono text-xs font-bold">EVENTS</p>
          <ul className="mt-3 space-y-2">
            {topEvents.length === 0 && <li className="font-mono text-xs text-black/50">No consented events yet.</li>}
            {topEvents.map(([t, n]) => (
              <li key={t} className="flex items-center justify-between gap-3 font-mono text-xs">
                <span className="truncate font-bold">{t}</span>
                <span className="border-ink shrink-0 rounded-full border-2 bg-cream px-2 py-0.5 font-bold">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-xs font-bold">TOP JOURNEYS (CONSENTED)</p>
          <ul className="mt-3 space-y-2">
            {journeys.length === 0 && <li className="font-mono text-xs text-black/50">No multi-page journeys yet.</li>}
            {journeys.map((j) => (
              <li key={j.id} className="truncate font-mono text-xs text-black/70">
                <span className="font-bold text-black">{j.id}</span> {j.path.join(" → ")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-5">
        <p className="font-mono text-xs font-bold">RECENT VIEWS</p>
        <ul className="mt-3 divide-y divide-ink/10">
          {recent.length === 0 && <li className="py-2 font-mono text-xs text-black/50">Nothing recorded yet — visit the site!</li>}
          {recent.map((v, i) => (
            <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 font-mono text-xs">
              <span className="font-bold">{v.path}</span>
              <span className="text-black/40">{v.country}</span>
              <span className="text-black/40">{v.device}</span>
              <span className="ml-auto text-black/40">{new Date(v.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
