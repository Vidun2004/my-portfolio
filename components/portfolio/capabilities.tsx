"use client";

import { motion } from "motion/react";
import { Code2, Smartphone, Server, Gamepad2, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

function TerminalVisual() {
  return (
    <div className="border-ink w-full overflow-hidden rounded-lg border-2 bg-ink font-mono text-xs text-cream">
      <div className="flex gap-1.5 border-b border-white/15 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-yellow-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
      </div>
      <div className="space-y-1 p-3">
        <p><span className="text-brand-teal">$</span> build --prod</p>
        <p className="text-white/50">✓ api · db · auth ready</p>
        <p><span className="text-brand-teal">$</span> ship it<span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-brand-yellow align-middle" /></p>
      </div>
    </div>
  );
}

function PhoneVisual() {
  return (
    <div className="border-ink bg-white flex h-full w-24 flex-col overflow-hidden rounded-xl border-2">
      <div className="bg-ink mx-auto mt-1.5 h-1 w-8 rounded-full" />
      <div className="relative m-1.5 flex-1 overflow-hidden rounded-md bg-cream">
        <motion.div
          animate={{ x: ["0%", "0%", "-100%", "-100%", "0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.45, 0.8, 1] }}
          className="flex h-full w-[200%]"
        >
          <div className="bg-brand-blue flex w-1/2 flex-col items-center justify-center gap-1 border-r-2 border-ink p-1">
            <span className="bg-white rounded px-1 font-mono text-[9px] font-bold">HOME</span>
            <span className="bg-white/70 h-1 w-3/4 rounded" />
            <span className="bg-white/70 h-1 w-1/2 rounded" />
          </div>
          <div className="bg-brand-pink flex w-1/2 flex-col items-center justify-center gap-1 p-1">
            <span className="bg-white rounded px-1 font-mono text-[9px] font-bold">CHAT</span>
            <span className="bg-white/70 h-1 w-3/4 rounded" />
            <span className="bg-white/70 h-1 w-1/2 rounded" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ServerVisual() {
  const nodes = [
    { label: "API", delay: "0s" },
    { label: "DB", delay: "0.6s" },
    { label: "NET", delay: "1.2s" },
  ];
  return (
    <div className="flex w-full items-center justify-around font-mono text-xs font-bold">
      <span className="rounded border-2 border-ink bg-white px-2 py-1">SRV</span>
      <span className="h-0.5 flex-1 bg-ink/30" />
      {nodes.map((n) => (
        <span key={n.label} className="flex items-center">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-40" style={{ animationDelay: n.delay }} />
            <span className="relative inline-flex size-3 rounded-full border-2 border-ink bg-brand-yellow" />
          </span>
          <span className="ml-1 rounded border border-ink/30 bg-white px-1">{n.label}</span>
          <span className="mx-1 h-0.5 w-3 bg-ink/30 last:hidden" />
        </span>
      ))}
    </div>
  );
}

function GameVisual() {
  return (
    <div className="border-ink relative h-full min-h-24 w-full overflow-hidden rounded-lg border-2 bg-ink">
      <div className="absolute inset-x-3 top-2 flex justify-between font-mono text-[10px] font-bold text-white/60">
        <span>SCORE 042</span>
        <span>♥♥♥</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-around px-6 pb-2">
        <span className="bg-brand-teal block h-6 w-3 animate-bounce rounded-sm" />
        <span className="bg-brand-yellow block h-10 w-3" />
        <span className="bg-brand-pink block h-14 w-3" />
        <span className="bg-brand-blue block h-8 w-3" />
      </div>
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
