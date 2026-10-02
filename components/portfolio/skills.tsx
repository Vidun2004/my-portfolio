"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/animation/reveal";
import type { SkillItem } from "@/lib/content";
import { cn } from "@/lib/utils";

type Skill = SkillItem;
type Category = Skill["cat"];

const FILTERS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "languages", label: "LANGUAGES" },
  { id: "frontend", label: "FRONTEND" },
  { id: "backend", label: "BACKEND" },
  { id: "mobile", label: "MOBILE" },
  { id: "database", label: "DATABASE" },
  { id: "tools", label: "TOOLS" },
];

const SKILLS: Skill[] = [
  { name: "TypeScript", cat: "languages", desc: "Main language for web apps.", level: 90, color: "bg-brand-blue" },
  { name: "Python", cat: "languages", desc: "Scripting, backends, experiments.", level: 75, color: "bg-brand-blue" },
  { name: "C", cat: "languages", desc: "Systems fundamentals.", level: 65, color: "bg-brand-blue" },
  { name: "C++", cat: "languages", desc: "DSA + game logic.", level: 65, color: "bg-brand-blue" },
  { name: "C#", cat: "languages", desc: "Unity game dev.", level: 60, color: "bg-brand-blue" },
  { name: "React", cat: "frontend", desc: "Component UI I reach for first.", level: 88, color: "bg-brand-yellow" },
  { name: "Next.js", cat: "frontend", desc: "App Router, SSR, full-stack.", level: 85, color: "bg-brand-yellow" },
  { name: "Tailwind", cat: "frontend", desc: "Rapid neobrutalist styling.", level: 90, color: "bg-brand-yellow" },
  { name: "Node.js", cat: "backend", desc: "APIs and server logic.", level: 80, color: "bg-brand-teal" },
  { name: "Auth", cat: "backend", desc: "Sessions, RLS, secure flows.", level: 75, color: "bg-brand-teal" },
  { name: "REST APIs", cat: "backend", desc: "Designing clean endpoints.", level: 82, color: "bg-brand-teal" },
  { name: "React Native", cat: "mobile", desc: "Cross-platform mobile apps.", level: 78, color: "bg-brand-yellow" },
  { name: "Expo", cat: "mobile", desc: "Fast mobile iteration.", level: 72, color: "bg-brand-yellow" },
  { name: "PostgreSQL", cat: "database", desc: "Relational modeling + queries.", level: 80, color: "bg-brand-pink" },
  { name: "Supabase", cat: "database", desc: "Auth, DB, storage backend.", level: 82, color: "bg-brand-pink" },
  { name: "Prisma", cat: "database", desc: "Type-safe DB access.", level: 76, color: "bg-brand-pink" },
  { name: "Git", cat: "tools", desc: "Branching, PRs, history.", level: 88, color: "bg-white" },
  { name: "Docker", cat: "tools", desc: "Containers for dev + deploy.", level: 70, color: "bg-white" },
  { name: "Linux", cat: "tools", desc: "Daily driver + servers.", level: 78, color: "bg-white" },
];

function Ticker({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // 4 copies = two identical halves, so -50% translate loops without a jump.
  // No gap on the flex container — trailing space lives inside each item.
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "flex w-max",
          reverse ? "animate-marquee2" : "animate-marquee",
          "[animation-duration:30s]",
        )}
      >
        {loop.map((t, i) => (
          <span
            key={`${t}-${i}`}
            aria-hidden={i >= items.length}
            className="flex items-center gap-6 pr-6 font-mono text-sm font-bold whitespace-nowrap"
          >
            {t} <span aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills({ items }: { items?: SkillItem[] }) {
  const [active, setActive] = useState<Category | "all">("all");
  const reduce = useReducedMotion();
  const all = items?.length ? items : SKILLS;
  const filtered = active === "all" ? all : all.filter((s) => s.cat === active);
  const tickerItems = all.map((s) => s.name.toUpperCase());

  return (
    <section id="skills" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-sm text-black/50">
            The tools I use to turn ideas into software.
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
            My toolbox
          </h2>
        </Reveal>
      </div>

      {/* Unique tilted marquee tickers */}
      <Reveal delay={0.1} className="mt-10 space-y-3">
        <div className="border-ink bg-brand-yellow -rotate-1 border-y-2 py-2">
          <Ticker items={tickerItems} />
        </div>
        <div className="border-ink bg-ink text-cream rotate-1 border-y-2 py-2">
          <Ticker items={tickerItems.slice().reverse()} reverse />
        </div>
      </Reveal>

      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* Filters */}
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={cn(
                  "rounded-full border-2 border-ink px-4 py-1.5 font-mono text-xs font-bold transition-all duration-200",
                  active === f.id
                    ? "bg-ink text-cream shadow-brutal"
                    : "bg-white hover:-translate-y-0.5 hover:shadow-brutal",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid with layout animation */}
        <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((s) => (
              <motion.div
                key={s.name}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="border-ink bg-white shadow-brutal rounded-brutal-md group border-2 p-4 transition-shadow duration-300 hover:shadow-brutal-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("rounded border-2 border-ink px-2 py-0.5 font-mono text-xs font-bold", s.color)}>
                    {s.name.toUpperCase()}
                  </span>
                  <span className="font-mono text-[11px] text-black/40 uppercase">
                    {s.cat}
                  </span>
                </div>
                <p className="mt-3 text-sm text-black/70">{s.desc}</p>
                <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-ink bg-cream">
                  <div
                    className={cn("h-full", s.color)}
                    style={{ width: `${s.level}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
