"use client";

import { Plane } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import { Badge } from "@/components/ui/badge";
import type { JourneyStep } from "@/lib/content";
import { cn } from "@/lib/utils";

const STEPS: JourneyStep[] = [
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

const BARS = [3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1];

function shortRole(role: string): string {
  return role.length > 14 ? role.split(" ").slice(0, 2).join(" ") : role;
}

export function Experience({ steps }: { steps?: JourneyStep[] }) {
  const items = steps?.length ? steps : STEPS;

  return (
    <section id="experience" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-sm text-black/50">
              Where I&apos;ve been, what I&apos;ve learned, and what I&apos;m building next.
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
              The journey
            </h2>
          </div>
          <div className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md flex -rotate-1 items-center gap-2 border-2 px-4 py-2 font-mono text-sm font-bold">
            <Plane size={16} /> VIDUN AIRLINES ✦ ALL ABOARD
          </div>
        </Reveal>

        <div className="mx-auto mt-12 max-w-4xl space-y-6">
          {items.map((s, i) => {
            const from = items[i + 1] ? shortRole(items[i + 1].role) : "CURIOSITY";
            return (
              <Reveal key={s.year + s.role} delay={i * 0.06}>
                <div
                  className={cn(
                    "border-ink bg-white shadow-brutal rounded-brutal-md relative flex items-stretch border-2 transition-all duration-300 hover:rotate-0 hover:shadow-brutal-lg",
                    i % 2 ? "rotate-1" : "-rotate-1",
                  )}
                >
                  {/* main stub */}
                  <div className="flex-1 p-5 md:p-6">
                    <div className="flex items-center gap-3 font-mono text-xs font-bold">
                      <span className="text-black/40">{from}</span>
                      <span aria-hidden>✈ ───</span>
                      <span className={cn("rounded border-2 border-ink px-2 py-0.5", s.color)}>
                        {shortRole(s.role)}
                      </span>
                      {i === 0 && (
                        <span className="bg-ink text-cream rounded-full px-2 py-0.5 text-[11px]">
                          ● ONBOARD
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-2xl font-bold md:text-3xl">{s.role}</h3>
                    <p className="mt-1 text-sm text-black/70">{s.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.tech.map((t) => (
                        <Badge key={t} variant="neutral" className="font-mono text-[11px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-6 font-mono text-xs font-bold text-black/50">
                      <span>DATE<span className="block text-sm text-ink">{s.year}</span></span>
                      <span>GATE<span className="block text-sm text-ink">G{i + 1}</span></span>
                      <span>SEAT<span className="block text-sm text-ink">{s.year.slice(2)}{"ABCDEF"[i % 6]}</span></span>
                    </div>
                  </div>

                  {/* perforation */}
                  <div aria-hidden className="relative w-6 shrink-0 border-l-2 border-dashed border-ink/40">
                    <span className="bg-cream absolute -top-3.5 -left-3.5 size-6 rounded-full" />
                    <span className="bg-cream absolute -bottom-3.5 -left-3.5 size-6 rounded-full" />
                  </div>

                  {/* barcode stub */}
                  <div className="hidden w-28 shrink-0 flex-col items-center justify-center gap-2 p-4 sm:flex">
                    <div className="flex h-12 items-stretch gap-[2px]">
                      {BARS.map((w, b) => (
                        <span key={b} className="bg-ink" style={{ width: w }} />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] font-bold tracking-widest">ADMIT ONE</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
