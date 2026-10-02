"use client";

import { MapPin, GraduationCap, Coffee } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import { Floating } from "@/components/animation/floating";
import { cn } from "@/lib/utils";

const MINI = [
  {
    label: "CURRENTLY BUILDING",
    body: "Production applications",
    color: "bg-brand-blue",
    tilt: "rotate-1",
  },
  {
    label: "EXPLORING",
    body: "AI • Systems • Game Dev",
    color: "bg-brand-teal",
    tilt: "-rotate-1",
  },
  {
    label: "I LIKE",
    body: "Clean architecture • Good UX • Automation",
    color: "bg-brand-yellow",
    tilt: "rotate-2",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-sm text-black/50">
            A developer who likes understanding how things actually work.
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
            Who&apos;s behind
            <br />
            the code?
          </h2>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 md:grid-cols-2">
          {/* Left visual */}
          <Reveal delay={0.1}>
            <div className="relative mx-auto w-full max-w-md">
              <div className="border-ink bg-white shadow-brutal-lg rounded-brutal-lg overflow-hidden border-2">
                <div className="bg-ink text-cream flex items-center justify-between px-4 py-2 font-mono text-xs">
                  <span>profile.png</span>
                  <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-400" />
                    <span className="size-2.5 rounded-full bg-yellow-400" />
                    <span className="size-2.5 rounded-full bg-green-400" />
                  </span>
                </div>
                <div className="bg-brand-pink flex min-h-[340px] flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="border-ink bg-cream flex size-28 items-center justify-center rounded-full border-2 font-mono text-4xl font-bold">
                    V
                  </div>
                  <p className="font-mono text-sm font-bold">
                    {"<Software Engineer />"}
                  </p>
                  <p className="flex items-center gap-1 font-mono text-xs text-black/60">
                    <MapPin size={14} /> Sri Lanka • open to work
                  </p>
                </div>
              </div>

              <Floating
                className="absolute -top-5 -left-3 md:-left-8"
                distance={8}
                duration={3.4}
              >
                <div className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md border-2 px-3 py-1.5 font-mono text-xs font-bold">
                  CURRENTLY BUILDING
                </div>
              </Floating>
              <Floating
                className="absolute -right-3 -bottom-5 md:-right-6"
                distance={7}
                duration={3}
                delay={0.6}
              >
                <div className="border-ink bg-brand-teal shadow-brutal rounded-brutal-md border-2 px-3 py-1.5 font-mono text-xs font-bold">
                  ALWAYS LEARNING
                </div>
              </Floating>
            </div>
          </Reveal>

          {/* Right copy */}
          <div>
            <Reveal delay={0.15}>
              <h3 className="text-2xl font-bold">WHO AM I?</h3>
              <p className="mt-4 text-base leading-relaxed text-black/80 md:text-lg">
                I&apos;m Vidun — a Software Engineering student who enjoys
                figuring out how things work under the hood, from frontend
                interactions to servers and databases.
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-black/60">
                <span className="flex items-center gap-1">
                  <GraduationCap size={14} /> Software Engineering
                </span>
                <span className="flex items-center gap-1">
                  <Coffee size={14} /> fueled by curiosity
                </span>
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {MINI.map((m, i) => (
                <Reveal key={m.label} delay={0.2 + i * 0.08}>
                  <div
                    className={cn(
                      "border-ink shadow-brutal rounded-brutal-md border-2 p-4 transition-all duration-300 hover:rotate-0 hover:shadow-brutal-lg",
                      m.color,
                      m.tilt,
                    )}
                  >
                    <p className="font-mono text-[11px] font-bold tracking-wide">
                      {m.label}
                    </p>
                    <p className="mt-2 text-sm font-bold">{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
