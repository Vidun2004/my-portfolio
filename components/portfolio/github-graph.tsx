"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/animation/reveal";
import type { ContributionData } from "@/lib/github";
import { cn } from "@/lib/utils";

const LEVELS = ["bg-white", "bg-[#b7e9cd]", "bg-[#5ed598]", "bg-[#1d9e57]", "bg-[#0b5c31]"];

function level(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/** Proof-of-work band — GitHub contribution grid in theme dress. Hidden when unconfigured. */
export function GithubGraph({ data }: { data: ContributionData | null }) {
  if (!data) return null;
  return (
    <section id="proof" className="flex w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-sm text-black/50">
              Green squares don&apos;t lie — public commits, last 12 months.
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
              Proof of work
            </h2>
          </div>
          <div className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md rotate-1 border-2 px-4 py-2 font-mono text-sm font-bold">
            {data.total.toLocaleString()} CONTRIBUTIONS
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-10 border-2 p-4 md:p-6">
            <div className="overflow-x-auto pb-1">
              <div className="flex w-max gap-[3px]">
                {data.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) => (
                      <motion.span
                        key={day.date}
                        title={`${day.count} on ${day.date}`}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          duration: 0.25,
                          ease: "easeOut",
                          delay: Math.min(1.1, wi * 0.02 + di * 0.004),
                        }}
                        className={cn("size-3 rounded-[3px] border border-ink/25", LEVELS[level(day.count)])}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <a
                href={`https://github.com/${data.login}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs font-bold hover:underline"
              >
                @{data.login} ON GITHUB ↗
              </a>
              <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-black/50">
                LESS
                {LEVELS.map((c, i) => (
                  <span key={i} className={cn("size-3 rounded-[3px] border border-ink/25", c)} />
                ))}
                MORE
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
