"use client";

import { Reveal } from "@/components/animation/reveal";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    year: "2026",
    role: "IT JUNIOR EXECUTIVE",
    desc: "Building systems, solving problems, learning from production.",
    tech: ["Systems", "Support", "Automation"],
    color: "bg-brand-blue",
  },
  {
    year: "2025",
    role: "IT INTERNSHIP",
    desc: "First taste of real-world IT — tickets, networks, users.",
    tech: ["Networks", "Troubleshooting"],
    color: "bg-brand-teal",
  },
  {
    year: "2024",
    role: "SOFTWARE ENGINEERING",
    desc: "Started the degree. Fell in love with building software.",
    tech: ["TypeScript", "DSA"],
    color: "bg-brand-yellow",
  },
];

export function Experience() {
  return (
    <section id="experience" className="w-full border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-sm text-black/50">
            Where I&apos;ve been, what I&apos;ve learned, and what I&apos;m building next.
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
            The journey
          </h2>
        </Reveal>

        <div className="relative mt-12 ml-2 border-l-2 border-ink pl-8 md:ml-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.year} delay={i * 0.1} className="relative pb-10 last:pb-0">
              <span
                className="absolute top-1 -left-8 flex size-4 -translate-x-[9px] items-center justify-center rounded-full border-2 border-ink bg-cream md:-left-8"
              >
                <span className="size-1.5 rounded-full bg-ink" />
              </span>
              <p className="font-mono text-sm font-bold text-black/40">{s.year}</p>
              <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-2 max-w-xl border-2 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded border-2 border-ink px-2 py-0.5 font-mono text-xs font-bold ${s.color}`}>
                    {s.year}
                  </span>
                  <h3 className="text-xl font-bold">{s.role}</h3>
                </div>
                <p className="mt-2 text-sm text-black/70">{s.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.tech.map((t) => (
                    <Badge key={t} variant="neutral" className="font-mono text-[11px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
