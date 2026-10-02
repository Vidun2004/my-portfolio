"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { label: "DASHBOARD", href: "/admin", ready: true },
  { label: "PROJECTS", href: "/admin/projects", ready: true },
  { label: "SKILLS", href: "/admin/skills", ready: true },
  { label: "EXPERIENCE", href: "/admin/experience", ready: true },
  { label: "MESSAGES", href: "/admin/messages", ready: true },
  { label: "ABOUT", href: "/admin/about", ready: true },
  { label: "MEDIA", href: "/admin/media", ready: true },
  { label: "ACTIVITY", href: "/admin/activity", ready: true },
  { label: "SETTINGS", href: "/admin/settings", ready: true },
];

export function AdminSidebar({ email }: { email?: string }) {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="border-ink bg-white flex w-full flex-col gap-1 border-b-2 p-4 md:min-h-screen md:w-60 md:border-r-2 md:border-b-0">
      <a href="/admin" className="flex items-center gap-2 text-lg font-bold">
        <span className="border-ink bg-brand-blue flex size-8 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold">
          {"{ }"}
        </span>
        ADMIN
      </a>
      {email && <p className="truncate font-mono text-xs text-black/50">{email}</p>}
      <nav className="mt-4 flex flex-row flex-wrap gap-2 md:flex-col">
        {NAV.map((n) =>
          n.ready ? (
            <a
              key={n.href}
              href={n.href}
              className="rounded-lg border-2 border-transparent px-3 py-2 font-mono text-sm font-bold hover:border-ink hover:bg-cream"
            >
              {n.label}
            </a>
          ) : (
            <span
              key={n.href}
              className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 font-mono text-sm font-bold text-black/30"
            >
              {n.label}
              <span className="rounded-full border border-ink/20 px-1.5 text-[10px]">SOON</span>
            </span>
          ),
        )}
      </nav>
      <div className="mt-auto flex gap-2 pt-4">
        <a
          href="/"
          className="flex-1 rounded-lg border-2 border-ink bg-cream px-3 py-2 text-center font-mono text-xs font-bold hover:-translate-y-0.5"
        >
          VIEW SITE
        </a>
        <button
          onClick={logout}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border-2 border-ink bg-white px-3 py-2 font-mono text-xs font-bold hover:bg-red-50"
        >
          <LogOut size={14} /> OUT
        </button>
      </div>
    </aside>
  );
}
