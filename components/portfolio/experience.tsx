"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Reveal } from "@/components/animation/reveal";
import { Badge } from "@/components/ui/badge";
import type { JourneyStep } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

function stationCode(s: JourneyStep): string {
  const initials = s.role
    .split(" ")
    .map((w) => w[0])
    .slice(0, 3)
    .join("");
  return `’${s.year.slice(2)} · ${initials}`;
}

export function Experience({ steps }: { steps?: JourneyStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const trainRef = useRef<HTMLSpanElement>(null);
  const items = steps?.length ? steps : STEPS;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const trigger = {
        trigger: trackRef.current,
        start: "top 70%",
        end: "bottom 55%",
        scrub: 0.6,
      } as const;
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: trigger },
      );
      gsap.fromTo(
        trainRef.current,
        { y: 0 },
        {
          y: () => (trackRef.current?.clientHeight ?? 0) - 16,
          ease: "none",
          scrollTrigger: { ...trigger, invalidateOnRefresh: true },
        },
      );
    },
    { scope: trackRef },
  );

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
          <div className="border-ink bg-brand-teal shadow-brutal rounded-brutal-md rotate-1 border-2 px-4 py-2 font-mono text-sm font-bold">
            ▼ CAREER LINE — ALL ABOARD
          </div>
        </Reveal>

        <div ref={trackRef} className="relative mt-12">
          {/* rail */}
          <span aria-hidden className="bg-ink/10 absolute top-0 bottom-0 left-5 w-1.5 rounded-full md:left-1/2 md:-translate-x-1/2" />
          <span aria-hidden className="absolute top-0 bottom-0 left-5 w-1.5 md:left-1/2 md:-translate-x-1/2">
            <span ref={progressRef} className="bg-ink block h-full w-full origin-top scale-y-0 rounded-full" />
          </span>
          {/* traveling train dot */}
          <span
            aria-hidden
            className="absolute top-0 left-5 z-10 md:left-1/2 md:-translate-x-1/2"
          >
            <span ref={trainRef} className="border-ink bg-brand-pink shadow-brutal block size-4 rounded-full border-2" />
          </span>

          {items.map((s, i) => {
            const right = i % 2 === 0;
            return (
              <div
                key={s.year + s.role}
                className={cn(
                  "relative pb-10 pl-14 last:pb-0 md:w-1/2 md:pl-0",
                  right ? "md:ml-auto md:pl-10" : "md:mr-auto md:pr-10",
                )}
              >
                {/* station node */}
                <span
                  className={cn(
                    "border-ink absolute top-5 left-5 z-10 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border-[3px] bg-white md:translate-x-0",
                    right ? "md:-left-3.5" : "md:-right-3.5",
                  )}
                >
                  <span className={cn("size-2.5 rounded-full", i === 0 ? "animate-pulse bg-ink" : "bg-ink/40")} />
                </span>
                <Reveal delay={0.05}>
                  <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded border-2 border-ink px-2 py-0.5 font-mono text-xs font-bold", s.color)}>
                        {stationCode(s)}
                      </span>
                      {i === 0 && (
                        <span className="bg-ink text-cream rounded-full px-2 py-0.5 font-mono text-[11px] font-bold">
                          ● YOU ARE HERE
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-xl font-bold">{s.role}</h3>
                    <p className="mt-1 font-mono text-xs font-bold text-black/40">{s.year}</p>
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
