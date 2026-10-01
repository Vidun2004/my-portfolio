import { createAdminClient } from "@/lib/supabase/admin";

async function getStats() {
  const admin = createAdminClient();
  const [{ count: projects }, { count: published }, { count: messages }] =
    await Promise.all([
      admin.from("projects").select("id", { count: "exact", head: true }),
      admin
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      admin
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
    ]);
  return {
    projects: projects ?? 0,
    published: published ?? 0,
    drafts: (projects ?? 0) - (published ?? 0),
    messages: messages ?? 0,
  };
}

const CARDS = [
  { label: "PROJECTS", key: "projects", color: "bg-brand-blue" },
  { label: "PUBLISHED", key: "published", color: "bg-brand-teal" },
  { label: "DRAFTS", key: "drafts", color: "bg-brand-yellow" },
  { label: "NEW MESSAGES", key: "messages", color: "bg-brand-pink" },
] as const;

export default async function AdminDashboard() {
  const stats = await getStats();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "GOOD MORNING" : hour < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";

  return (
    <div>
      <p className="font-mono text-sm text-black/50">VIDUN.DEV ADMIN</p>
      <h1 className="mt-1 text-4xl font-bold uppercase md:text-5xl">
        {greeting}, Vidun.
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <div
            key={c.key}
            className={`border-ink shadow-brutal rounded-brutal-md border-2 p-5 ${c.color}`}
          >
            <p className="font-mono text-xs font-bold">{c.label}</p>
            <p className="mt-1 text-5xl font-bold">{stats[c.key]}</p>
          </div>
        ))}
      </div>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6">
        <h2 className="font-mono text-xs font-bold text-black/50">NEXT UP</h2>
        <p className="mt-2 text-sm text-black/70">
          CRUD pages for projects, skills, experience and messages land here —
          each in its own commit.
        </p>
      </div>
    </div>
  );
}
