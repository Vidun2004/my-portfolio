"use client";

import { motion } from "motion/react";
import { Code2, Smartphone, Server, Gamepad2, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

function TerminalVisual() {
  return (
    <div className="border-ink w-full overflow-hidden rounded-lg border-2 bg-ink font-mono text-xs text-cream">
      <div className="flex items-center gap-1.5 border-b border-white/15 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-yellow-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-white/40">deploy.sh</span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-green-400/20 px-2 py-0.5 text-[10px] font-bold text-green-300">
          <span className="size-1.5 animate-pulse rounded-full bg-green-400" /> LIVE
        </span>
      </div>
      <div className="space-y-1.5 p-3">
        <p><span className="text-brand-teal">$</span> build --prod</p>
        <div className="h-2 overflow-hidden rounded-full border border-white/20 bg-white/10">
          <motion.div
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
            className="bg-brand-teal h-full rounded-full"
          />
        </div>
        {["✓ api compiled", "✓ db migrated", "✓ auth wired"].map((line, k) => (
          <motion.p
            key={line}
            animate={{ opacity: [0.25, 1, 1, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, delay: k * 0.9, ease: "easeInOut" }}
            className="text-white/70"
          >
            {line}
          </motion.p>
        ))}
        <p><span className="text-brand-teal">$</span> ship it<span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-brand-yellow align-middle" /></p>
      </div>
    </div>
  );
}

function PhoneVisual() {
  return (
    <div className="border-ink bg-white mx-auto flex h-52 w-28 flex-col overflow-hidden rounded-xl border-2">
      <div className="bg-ink mx-auto mt-1.5 h-1 w-8 shrink-0 rounded-full" />
      <div className="bg-ink/80 flex items-center justify-between px-2 py-1 font-mono text-[8px] font-bold text-white">
        <span>9:41</span>
        <span className="flex gap-0.5">
          <span className="size-1 rounded-full bg-white" />
          <span className="size-1 rounded-full bg-white" />
          <span className="size-1 rounded-full bg-brand-yellow" />
        </span>
      </div>
      <div className="relative flex flex-1 flex-col justify-end gap-1 overflow-hidden bg-cream p-1.5">
        <motion.div
          animate={{ opacity: [0, 0, 1, 1, 0], x: [8, 8, 0, 0, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeOut" }}
          className="max-w-[85%] rounded-lg rounded-bl-none border border-ink/20 bg-white px-1.5 py-1 font-mono text-[8px] font-bold"
        >
          shipped the build 🚀
        </motion.div>
        <motion.div
          animate={{ opacity: [0, 0, 0, 1, 1, 0], x: [-8, -8, -8, 0, 0, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeOut" }}
          className="border-ink bg-brand-blue max-w-[85%] self-end rounded-lg rounded-br-none border px-1.5 py-1 font-mono text-[8px] font-bold"
        >
          on my phone. nice.
        </motion.div>
        <motion.div
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, times: [0, 0.08, 0.2, 0.3] }}
          className="flex gap-0.5 px-1 py-0.5"
        >
          {[0, 1, 2].map((d) => (
            <motion.span
              key={d}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
              className="bg-ink/50 size-1 rounded-full"
            />
          ))}
        </motion.div>
      </div>
      <div className="border-ink flex justify-around border-t-2 border-ink bg-white px-2 py-1">
        <span className="bg-brand-pink size-2.5 rounded-sm border border-ink" />
        <span className="size-2.5 rounded-full border border-ink bg-cream" />
        <span className="size-2.5 rounded-full border border-ink bg-cream" />
      </div>
    </div>
  );
}

function ServerVisual() {
  const units = [0, 1, 2];
  return (
    <div className="border-ink flex w-full items-stretch gap-2 rounded-lg border-2 bg-cream p-2">
      {/* rack */}
      <div className="flex w-16 flex-col gap-1">
        {units.map((u) => (
          <div key={u} className="border-ink rounded border-2 bg-ink px-1 py-1">
            <div className="flex items-center gap-1">
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: u * 0.35 }}
                className={u === 1 ? "bg-brand-pink size-1.5 rounded-full" : "size-1.5 rounded-full bg-green-400"}
              />
              <span className="h-0.5 flex-1 rounded bg-white/25" />
            </div>
            <div className="mt-1 flex gap-0.5">
              <span className="bg-brand-teal/70 h-1 flex-1 rounded-sm" />
              <span className="h-1 w-1/3 rounded-sm bg-white/20" />
            </div>
          </div>
        ))}
      </div>
      {/* traffic */}
      <div className="relative flex flex-1 flex-col justify-center gap-1.5 overflow-hidden rounded border border-ink/20 bg-white px-2 py-1.5 font-mono text-[9px] font-bold">
        {["API → OK", "DB → 12ms"].map((line, k) => (
          <div key={line} className="relative overflow-hidden rounded bg-cream px-1.5 py-1">
            <span className="relative z-10">{line}</span>
            <motion.span
              animate={{ x: ["-120%", "350%"] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: k * 0.9, ease: "linear" }}
              className="bg-brand-yellow absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full border border-ink"
            />
          </div>
        ))}
        <div className="flex items-center gap-1 text-[8px] text-black/50">
          <span className="size-1.5 animate-pulse rounded-full bg-green-500" /> 99.9% UPTIME
        </div>
      </div>
    </div>
  );
}

function GameVisual() {
  return (
    <div className="border-ink relative h-full min-h-36 w-full overflow-hidden rounded-lg border-2 bg-ink">
      {/* stars */}
      {[8, 30, 55, 78].map((left, k) => (
        <motion.span
          key={left}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 1.6 + k * 0.4, repeat: Infinity, delay: k * 0.5 }}
          className="absolute top-2 size-1 rounded-full bg-white"
          style={{ left: `${left}%` }}
        />
      ))}
      <div className="absolute inset-x-3 top-2 flex justify-between font-mono text-[10px] font-bold text-white/70">
        <span>SCORE 042</span>
        <span className="text-brand-pink">♥♥♥</span>
      </div>
      {/* coin */}
      <motion.div
        animate={{ x: [70, -70], y: [0, -6, 0] }}
        transition={{ x: { duration: 3.2, repeat: Infinity, ease: "linear" }, y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute top-8 left-1/2"
      >
        <motion.span
          animate={{ scaleX: [1, 0.2, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          className="border-ink bg-brand-yellow block size-4 rounded-full border-2"
        />
      </motion.div>
      {/* scrolling ground */}
      <div className="bg-brand-teal absolute inset-x-0 bottom-0 h-5 border-t-2 border-white/20">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          className="flex h-full w-[200%] items-center gap-6 px-4"
        >
          {Array.from({ length: 12 }).map((_, k) => (
            <span key={k} className="h-1 w-4 shrink-0 rounded bg-black/25" />
          ))}
        </motion.div>
      </div>
      {/* player */}
      <motion.div
        animate={{ y: [0, 0, -38, 0, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.5, 0.7, 1] }}
        className="absolute bottom-5 left-10"
      >
        <span className="border-ink bg-brand-yellow block size-6 rounded-[4px] border-2" />
      </motion.div>
      {/* obstacle */}
      <motion.div
        animate={{ x: [190, -190] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        className="absolute right-0 bottom-5"
      >
        <span className="border-ink bg-brand-pink block h-8 w-4 rounded-t border-2" />
      </motion.div>
    </div>
  );
}

const CARDS = [
  {
    n: "01",
    title: "FULL STACK",
    desc: "Web apps end-to-end — UI, APIs, auth and databases that survive production.",
    tags: ["Next.js", "APIs", "Postgres"],
    color: "bg-brand-blue",
    icon: Code2,
    span: "md:col-span-7",
    tilt: "md:-rotate-1",
    wide: true,
    visual: <TerminalVisual />,
  },
  {
    n: "02",
    title: "MOBILE",
    desc: "Cross-platform apps that feel native, not wrapped.",
    tags: ["React Native", "Expo"],
    color: "bg-brand-yellow",
    icon: Smartphone,
    span: "md:col-span-5",
    tilt: "md:rotate-1",
    wide: false,
    visual: <PhoneVisual />,
  },
  {
    n: "03",
    title: "SYSTEMS",
    desc: "Servers, networks and infra — how things actually run.",
    tags: ["Linux", "Docker"],
    color: "bg-brand-teal",
    icon: Server,
    span: "md:col-span-5",
    tilt: "md:rotate-1",
    wide: false,
    visual: <ServerVisual />,
  },
  {
    n: "04",
    title: "GAME DEV",
    desc: "Small worlds, player systems and playful experiments.",
    tags: ["C#", "Unity"],
    color: "bg-brand-pink",
    icon: Gamepad2,
    span: "md:col-span-7",
    tilt: "md:-rotate-1",
    wide: true,
    visual: <GameVisual />,
  },
];

export function Capabilities() {
  return (
    <section id="build" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-black/50">
              A few things I like turning into working software.
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
              What I build
            </h2>
          </div>
          <div className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md rotate-2 border-2 px-4 py-2 font-mono text-sm font-bold">
            4 DISCIPLINES ✦ 1 DEV
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-12">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className={c.span}>
              <a
                href="#projects"
                data-cursor="GO"
                className={cn(
                  "border-ink bg-white shadow-brutal rounded-brutal-md group flex h-full flex-col border-2 p-5",
                  "transition-all duration-300 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:rotate-0 hover:shadow-brutal-lg",
                  c.tilt,
                  c.wide && "md:flex-row md:items-center md:gap-6",
                )}
              >
                <div className={cn("flex items-center justify-center rounded-lg border-2 border-ink p-4", c.color, c.wide ? "min-h-44 md:w-2/5" : "min-h-36")}>
                  {c.visual}
                </div>
                <div className={cn("flex flex-1 flex-col", !c.wide && "mt-4", c.wide && "mt-4 md:mt-0")}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-black/40">{c.n}</span>
                    <ArrowUpRight size={18} className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <h3 className="mt-1 flex items-center gap-2 text-2xl font-bold">
                    <c.icon size={22} strokeWidth={2.5} />
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-black/70">{c.desc}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {c.tags.map((t) => (
                      <span key={t} className="rounded-full border border-ink/20 bg-cream px-2.5 py-0.5 font-mono text-[11px] font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
