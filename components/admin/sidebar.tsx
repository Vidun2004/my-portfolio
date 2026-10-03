"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Briefcase,
  FolderKanban,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Shapes,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    label: "OVERVIEW",
    items: [{ label: "DASHBOARD", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "CONTENT",
    items: [
      { label: "PROJECTS", href: "/admin/projects", icon: FolderKanban },
      { label: "SKILLS", href: "/admin/skills", icon: Shapes },
      { label: "EXPERIENCE", href: "/admin/experience", icon: Briefcase },
      { label: "ABOUT", href: "/admin/about", icon: User },
    ],
  },
  {
    label: "INBOX",
    items: [
      { label: "MESSAGES", href: "/admin/messages", icon: Inbox, badge: true },
      { label: "ACTIVITY", href: "/admin/activity", icon: Activity },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "MEDIA", href: "/admin/media", icon: Image },
      { label: "SETTINGS", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ email, unread }: { email?: string; unread: number }) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <aside className="border-ink bg-white flex w-full flex-col gap-1 border-b-2 p-4 md:sticky md:top-0 md:h-svh md:w-64 md:shrink-0 md:border-r-2 md:border-b-0">
      <a href="/admin" className="flex items-center gap-2 text-lg font-bold">
        <span className="border-ink bg-brand-blue flex size-8 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold">
          {"{ }"}
        </span>
        ADMIN
        <span className="border-ink bg-success ml-auto rounded-full border-2 px-2 py-0.5 font-mono text-[10px] font-bold md:hidden">
          ● LIVE
        </span>
      </a>
      {email && <p className="truncate font-mono text-xs text-black/50">{email}</p>}
      <nav className="mt-4 flex flex-row gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-col md:gap-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map((s) => (
          <div key={s.label} className="flex shrink-0 flex-row gap-2 md:flex-col md:gap-1">
            <p className="hidden font-mono text-[10px] font-bold tracking-widest text-black/40 md:block">
              {s.label}
            </p>
            {s.items.map((n) => (
              <a
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg border-2 px-3 py-2 font-mono text-sm font-bold transition-all",
                  isActive(n.href)
                    ? "border-ink bg-ink text-cream shadow-brutal"
                    : "border-transparent hover:border-ink hover:bg-cream",
                )}
              >
                <n.icon size={16} strokeWidth={2.5} />
                {n.label}
                {"badge" in n && n.badge && unread > 0 && (
                  <span className="bg-brand-pink text-ink ml-auto rounded-full border-2 border-current px-1.5 text-[11px]">
                    {unread}
                  </span>
                )}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="mt-auto hidden gap-2 pt-4 md:flex">
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
      <div className="mt-3 flex gap-2 md:hidden">
        <a
          href="/"
          className="flex-1 rounded-lg border-2 border-ink bg-cream px-3 py-2 text-center font-mono text-xs font-bold"
        >
          VIEW SITE
        </a>
        <button
          onClick={logout}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border-2 border-ink bg-white px-3 py-2 font-mono text-xs font-bold"
        >
          <LogOut size={14} /> OUT
        </button>
      </div>
    </aside>
  );
}
