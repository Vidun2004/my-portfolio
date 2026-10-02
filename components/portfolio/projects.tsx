"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { PROJECTS } from "@/lib/projects";
import type { ProjectCard } from "@/lib/projects";
import { Reveal } from "@/components/animation/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function TechRow({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <Badge key={t} variant="neutral" className="font-mono text-[11px]">
          {t}
        </Badge>
      ))}
    </div>
  );
}

export function Projects({ items }: { items?: ProjectCard[] }) {
  const list = items?.length ? items : PROJECTS;
  const lineup = list.slice(0, 4);
  const [slug, setSlug] = useState(list.find((p) => p.featured)?.slug ?? list[0]?.slug);
  const [dir, setDir] = useState(1);
  const active = list.find((p) => p.slug === slug) ?? list[0];
  const reduce = useReducedMotion();

  function go(delta: 1 | -1) {
    if (list.length < 2) return;
    const i = list.findIndex((p) => p.slug === slug);
    const next = list[(i + delta + list.length) % list.length];
    setDir(delta);
    setSlug(next.slug);
  }

  function pick(next: string) {
    const a = list.findIndex((p) => p.slug === slug);
    const b = list.findIndex((p) => p.slug === next);
    setDir(b > a ? 1 : -1);
    setSlug(next);
  }

  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        visualRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  if (!active) return null;

  return (
    <section ref={sectionRef} id="projects" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-sm text-black/50">
            Some experiments became products. Some products became lessons.
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
            Things I&apos;ve built
          </h2>
        </Reveal>

        {/* The Lineup: top 4, click to feature */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-2.5">
            <span className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md -rotate-2 border-2 px-3 py-1.5 font-mono text-xs font-bold">
              ★ THE LINEUP
            </span>
            {lineup.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => pick(p.slug)}
                className={cn(
                  "rounded-full border-2 border-ink px-4 py-1.5 font-mono text-xs font-bold transition-all duration-200",
                  p.slug === slug
                    ? "bg-ink text-cream shadow-brutal"
                    : "bg-white hover:-translate-y-0.5 hover:shadow-brutal",
                )}
              >
                <span className="mr-1.5 opacity-40">0{i + 1}</span>
                {p.title}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Stage with side arrows */}
        <div className="relative mt-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="border-ink bg-white shadow-brutal rounded-full absolute top-1/2 -left-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center border-2 transition-all hover:-translate-x-0.5 hover:shadow-brutal-lg md:-left-6 md:size-13"
          >
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next project"
            className="border-ink bg-white shadow-brutal rounded-full absolute top-1/2 -right-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center border-2 transition-all hover:translate-x-0.5 hover:shadow-brutal-lg md:-right-6 md:size-13"
          >
            <ChevronRight size={22} strokeWidth={3} />
          </button>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active.slug}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 48 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -36 * dir }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="border-ink bg-white shadow-brutal-lg rounded-brutal-lg grid overflow-hidden border-2 md:grid-cols-2"
            >
              <div className={cn("flex min-h-64 items-center justify-center overflow-hidden p-10 md:min-h-[420px]", active.color)}>
                <span ref={visualRef} className="text-center font-mono text-4xl font-bold md:text-6xl">
                  {active.visual}
                </span>
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
                <p className="font-mono text-xs font-bold text-black/40">
                  {active.featured ? "★ FEATURED PROJECT" : "PROJECT"}
                </p>
                <h3 className="text-3xl font-bold tracking-tight md:text-5xl">{active.title}</h3>
                <p className="max-w-md text-black/70">{active.desc}</p>
                <TechRow tech={active.tech} />
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href={`/projects/${active.slug}`} data-cursor="VIEW">
                    <Button className="font-mono">
                      CASE STUDY <ArrowRight size={16} />
                    </Button>
                  </a>
                  <a href={`/projects/${active.slug}`}>
                    <Button variant="neutral" className="font-mono">
                      <ArrowUpRight size={16} /> GITHUB
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
