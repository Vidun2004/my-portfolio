import Link from "next/link";
import { ArrowRight, ArrowUpRight, FolderKanban, ImagePlus, Shapes } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { timeAgo } from "@/lib/format";

async function getDashboard() {
  const admin = createAdminClient();
  const [
    { count: projects },
    { count: published },
    { data: messages },
    { data: activity },
  ] = await Promise.all([
    admin.from("projects").select("id", { count: "exact", head: true }),
    admin.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
    admin
      .from("contact_messages")
      .select("id, name, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    admin
      .from("activity_log")
      .select("id, actor, action, entity, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);
  return {
    stats: {
      projects: projects ?? 0,
      published: published ?? 0,
      drafts: (projects ?? 0) - (published ?? 0),
    },
    messages: (messages ?? []) as { id: string; name: string; email: string; status: string; created_at: string }[],
    activity: (activity ?? []) as { id: string; actor: string; action: string; entity: string; created_at: string }[],
  };
}

const CARDS = [
  { label: "PROJECTS", key: "projects", color: "bg-brand-blue", href: "/admin/projects" },
  { label: "PUBLISHED", key: "published", color: "bg-brand-teal", href: "/admin/projects" },
  { label: "DRAFTS", key: "drafts", color: "bg-brand-yellow", href: "/admin/projects" },
] as const;

const QUICK = [
  { label: "NEW PROJECT", href: "/admin/projects", icon: FolderKanban },
  { label: "NEW SKILL", href: "/admin/skills", icon: Shapes },
  { label: "UPLOAD MEDIA", href: "/admin/media", icon: ImagePlus },
  { label: "VIEW SITE ↗", href: "/", icon: ArrowUpRight },
];

export default async function AdminDashboard() {
  const { stats, messages, activity } = await getDashboard();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "GOOD MORNING" : hour < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";

  return (
    <div>
      <p className="font-mono text-sm text-black/50">VIDUN.DEV ADMIN</p>
      <h1 className="mt-1 text-4xl font-bold uppercase md:text-5xl">
        {greeting}, Vidun.
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className={`border-ink shadow-brutal rounded-brutal-md group border-2 p-5 transition-transform hover:-translate-y-1 ${c.color}`}
          >
            <p className="flex items-center justify-between font-mono text-xs font-bold">
              {c.label}
              <ArrowRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </p>
            <p className="mt-1 text-5xl font-bold">{stats[c.key]}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* inbox preview */}
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold text-black/50">INBOX — LATEST</h2>
            <Link href="/admin/messages" className="font-mono text-xs font-bold hover:underline">
              OPEN →
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {messages.length === 0 && (
              <p className="py-4 text-center font-mono text-sm text-black/40">Inbox zero. Suspiciously quiet.</p>
            )}
            {messages.map((m) => (
              <Link
                key={m.id}
                href="/admin/messages"
                className="flex items-center gap-2 rounded-lg border-2 border-transparent px-2 py-1.5 transition-colors hover:border-ink hover:bg-cream"
              >
                <span className={`size-2.5 shrink-0 rounded-full border border-ink ${m.status === "new" ? "bg-brand-pink" : "bg-ink/20"}`} />
                <span className="truncate text-sm font-bold">{m.name}</span>
                <span className="ml-auto shrink-0 font-mono text-[11px] text-black/40">{timeAgo(m.created_at)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* quick actions */}
          <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-5">
            <h2 className="font-mono text-xs font-bold text-black/50">QUICK ACTIONS</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {QUICK.map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="flex items-center gap-2 rounded-lg border-2 border-ink bg-cream px-3 py-2.5 font-mono text-xs font-bold transition-transform hover:-translate-y-0.5 hover:shadow-brutal"
                >
                  <q.icon size={15} strokeWidth={2.5} />
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* activity */}
          <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold text-black/50">RECENT ACTIVITY</h2>
              <Link href="/admin/activity" className="font-mono text-xs font-bold hover:underline">
                ALL →
              </Link>
            </div>
            <div className="mt-3 space-y-1.5">
              {activity.length === 0 && (
                <p className="py-4 text-center font-mono text-sm text-black/40">Nothing yet.</p>
              )}
              {activity.slice(0, 5).map((a) => (
                <p key={a.id} className="flex items-center gap-2 font-mono text-xs">
                  <span className="rounded bg-cream px-1.5 py-0.5 font-bold">{a.action}</span>
                  <span className="ml-auto shrink-0 text-black/40">{timeAgo(a.created_at)}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
