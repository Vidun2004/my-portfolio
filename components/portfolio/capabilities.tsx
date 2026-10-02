"use client";

import { Code2, Smartphone, Server, Gamepad2, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    n: "01",
    title: "FULL STACK",
    desc: "Web apps end-to-end — UI, APIs, auth and databases.",
    tags: ["Next.js", "APIs", "Postgres"],
    color: "bg-brand-blue",
    icon: Code2,
    visual: (
      <div className="flex items-center gap-2 font-mono text-sm font-bold">
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 group-hover:-rotate-6">
          {"</>"}
        </span>
        <span className="rounded border-2 border-ink bg-white px-1.5 py-0.5 text-xs">
          API
        </span>
        <span className="rounded border-2 border-ink bg-white px-1.5 py-0.5 text-xs">
          DB
        </span>
      </div>
    ),
  },
  {
    n: "02",
    title: "MOBILE",
    desc: "Cross-platform apps that feel native, not wrapped.",
    tags: ["React Native", "Expo", "Mobile UI"],
    color: "bg-brand-yellow",
    icon: Smartphone,
    visual: (
      <div className="border-ink bg-white rounded-lg border-2 px-3 py-2 font-mono text-xs font-bold shadow-[3px_3px_0_#171717] transition-transform duration-300 group-hover:-translate-y-1.5">
        APP
      </div>
    ),
  },
  {
    n: "03",
    title: "SYSTEMS",
    desc: "Servers, networks and infra — how things actually run.",
    tags: ["Linux", "Docker", "Networking"],
    color: "bg-brand-teal",
    icon: Server,
    visual: (
      <div className="font-mono text-xs font-bold leading-relaxed">
        <p>SERVER</p>
        <p className="text-black/50">{"├── API"}</p>
        <p className="text-black/50">{"├── DB"}</p>
        <p className="overflow-hidden whitespace-nowrap text-black/50">
          <span className="inline-block animate-pulse">{"└── NET"}</span>
        </p>
      </div>
    ),
  },
  {
    n: "04",
    title: "GAME DEV",
    desc: "Small worlds, player systems and playful experiments.",
    tags: ["C#", "Unity", "Systems"],
    color: "bg-brand-pink",
    icon: Gamepad2,
    visual: (
      <div className="font-mono text-xs font-bold leading-relaxed">
        <p className="transition-transform duration-300 group-hover:translate-x-1">
          PLAYER ↓
        </p>
        <p>WORLD ↓</p>
        <p>SYSTEM</p>
      </div>
    ),
  },
];

export function Capabilities() {
  return (
    <section id="build" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="text-center">
          <p className="font-mono text-sm text-black/50">
            A few things I like turning into working software.
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
            What I build
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <a
                href="#projects"
                className={cn(
                  "border-ink bg-white shadow-brutal rounded-brutal-md group flex h-full flex-col border-2 p-5",
                  "transition-all duration-300 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-brutal-lg",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-black/40">
                    {c.n}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>
                <div
                  className={cn(
                    "border-ink mt-4 flex h-28 items-center justify-center rounded-lg border-2",
                    c.color,
                  )}
                >
                  {c.visual}
                </div>
                <h3 className="mt-4 flex items-center gap-2 text-xl font-bold">
                  <c.icon size={20} strokeWidth={2.5} />
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-black/70">{c.desc}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-ink/20 bg-cream px-2.5 py-0.5 font-mono text-[11px] font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
