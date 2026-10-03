"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import {
  SiDocker,
  SiGit,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { Floating } from "@/components/animation/floating";
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

const TILTS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];

/** Real brand glyphs drifting behind the cards — ambient, seamless. */
const BG_ICONS: {
  Icon: React.ComponentType<{ size?: number | string; className?: string }>;
  cat: Category;
  color: string;
  className: string;
  distance: number;
  duration: number;
}[] = [
  { Icon: SiReact, cat: "frontend", color: "bg-brand-yellow", className: "top-[8%] left-[3%] -rotate-12", distance: 12, duration: 5 },
  { Icon: SiTypescript, cat: "languages", color: "bg-brand-blue", className: "top-[12%] right-[4%] rotate-6", distance: 9, duration: 4 },
  { Icon: SiPython, cat: "languages", color: "bg-brand-blue", className: "top-[42%] left-[1%] rotate-3", distance: 11, duration: 4.6 },
  { Icon: SiNextdotjs, cat: "frontend", color: "bg-white", className: "top-[38%] right-[2%] -rotate-6", distance: 8, duration: 3.6 },
  { Icon: SiTailwindcss, cat: "frontend", color: "bg-brand-teal", className: "bottom-[14%] left-[5%] rotate-12", distance: 10, duration: 4.2 },
  { Icon: SiDocker, cat: "tools", color: "bg-white", className: "right-[5%] bottom-[10%] -rotate-3", distance: 9, duration: 3.8 },
  { Icon: SiGit, cat: "tools", color: "bg-white", className: "top-[24%] left-[44%] hidden rotate-6 lg:block", distance: 7, duration: 3.2 },
  { Icon: SiSupabase, cat: "database", color: "bg-brand-pink", className: "right-[38%] bottom-[6%] hidden -rotate-12 lg:block", distance: 8, duration: 4.1 },
  { Icon: SiNodedotjs, cat: "backend", color: "bg-brand-teal", className: "top-[60%] left-[8%] hidden md:block", distance: 10, duration: 4.8 },
  { Icon: SiPostgresql, cat: "database", color: "bg-brand-pink", className: "top-[64%] right-[7%] hidden md:block", distance: 9, duration: 3.5 },
];

/** One sticker chip — dodges the cursor, pops on hover, filters on click. */
function StickerChip({
  Icon,
  cat,
  color,
  className,
  distance,
  duration,
  delay,
  mx,
  my,
  boxRef,
  onPick,
}: {
  Icon: React.ComponentType<{ size?: number | string; className?: string }>;
  cat: Category;
  color: string;
  className: string;
  distance: number;
  duration: number;
  delay: number;
  mx: { get(): number; set(v: number): void };
  my: { get(): number; set(v: number): void };
  boxRef: React.RefObject<HTMLElement | null>;
  onPick: (cat: Category) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const center = useRef({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce) return;
    function measure() {
      const box = boxRef.current?.getBoundingClientRect();
      const r = ref.current?.getBoundingClientRect();
      if (box && r) {
        center.current = {
          x: r.left - box.left + r.width / 2,
          y: r.top - box.top + r.height / 2,
        };
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [boxRef, reduce]);

  const RADIUS = 150;
  const FORCE = 22;
  const ox = useTransform([mx as never, my as never], (v) => {
    const vals = v as number[];
    const dx = center.current.x - vals[0];
    const dy = center.current.y - vals[1];
    const d = Math.hypot(dx, dy) || 1;
    return (dx / d) * Math.max(0, 1 - d / RADIUS) * FORCE;
  });
  const oy = useTransform([mx as never, my as never], (v) => {
    const vals = v as number[];
    const dx = center.current.x - vals[0];
    const dy = center.current.y - vals[1];
    const d = Math.hypot(dx, dy) || 1;
    return (dy / d) * Math.max(0, 1 - d / RADIUS) * FORCE;
  });
  const sx = useSpring(ox, { stiffness: 200, damping: 17 });
  const sy = useSpring(oy, { stiffness: 200, damping: 17 });

  return (
    <div className={`absolute ${className}`}>
      <Floating distance={distance} duration={duration} delay={delay}>
        <motion.button
          ref={ref}
          type="button"
          data-cursor="FILTER"
          title={`Filter ${cat}`}
          onClick={() => onPick(cat)}
          style={reduce ? undefined : { x: sx, y: sy }}
          whileHover={reduce ? undefined : { scale: 1.2, rotate: 0 }}
          whileTap={{ scale: 0.9 }}
          className="pointer-events-auto cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <span
            className={cn(
              "border-ink shadow-brutal flex size-11 items-center justify-center rounded-xl border-2",
              color,
            )}
          >
            <Icon size={20} />
          </span>
        </motion.button>
      </Floating>
    </div>
  );
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  function onMove(e: MouseEvent) {
    if (reduce) return;
    const box = sectionRef.current?.getBoundingClientRect();
    if (!box) return;
    mx.set(e.clientX - box.left);
    my.set(e.clientY - box.top);
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(-9999);
        my.set(-9999);
      }}
      className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden border-t-2 border-ink/10 py-20 md:py-28"
    >
      {/* interactive sticker chips behind the cards */}
      <div aria-hidden={false} className="pointer-events-none absolute inset-0">
        {BG_ICONS.map(({ Icon, cat, color, className, distance, duration }, i) => (
          <StickerChip
            key={cat + i}
            Icon={Icon}
            cat={cat}
            color={color}
            className={className}
            distance={distance}
            duration={duration}
            delay={(i * 0.7) % 2}
            mx={mx}
            my={my}
            boxRef={sectionRef}
            onPick={setActive}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-sm text-black/50">
              The tools I use to turn ideas into software.
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
              My toolbox
            </h2>
          </div>
          <div className="border-ink bg-brand-pink shadow-brutal rounded-brutal-md -rotate-2 border-2 px-4 py-2 font-mono text-sm font-bold">
            {all.length} STICKERS ✦ COLLECTED
          </div>
        </Reveal>
      </div>

      {/* Tilted marquee tickers */}
      <Reveal delay={0.1} className="relative mt-10 space-y-3">
        <div className="border-ink bg-brand-yellow -rotate-1 border-y-2 py-2">
          <Ticker items={tickerItems} />
        </div>
        <div className="border-ink bg-ink text-cream rotate-1 border-y-2 py-2">
          <Ticker items={tickerItems.slice().reverse()} reverse />
        </div>
      </Reveal>

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
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

        {/* Sticker wall */}
        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => (
              <motion.div
                key={s.name}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "border-ink shadow-brutal rounded-brutal-md relative border-2 p-5",
                  "transition-all duration-300 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:rotate-0 hover:shadow-brutal-lg",
                  s.color,
                  TILTS[i % TILTS.length],
                )}
              >
                {s.level >= 85 && (
                  <span className="border-ink bg-white absolute -top-3 -right-2 rotate-12 rounded-full border-2 px-2.5 py-0.5 font-mono text-[11px] font-bold shadow-[2px_2px_0_#171717]">
                    ★ PRO
                  </span>
                )}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold tracking-widest uppercase opacity-60">
                    {s.cat}
                  </span>
                  <span className="border-ink rounded-full border-2 bg-white px-2 py-0.5 font-mono text-[11px] font-bold">
                    LV {s.level}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight">{s.name.toUpperCase()}</p>
                <p className="mt-1 text-sm font-medium text-black/70">{s.desc}</p>
                <div className="border-ink mt-4 h-3.5 overflow-hidden rounded-full border-2 bg-white/70">
                  <motion.div
                    initial={reduce ? false : { width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-ink"
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
