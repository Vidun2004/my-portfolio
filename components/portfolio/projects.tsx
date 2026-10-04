"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import type { ProjectCard } from "@/lib/projects";
import { Reveal } from "@/components/animation/reveal";
import { LAST_PROJECT_KEY, TransitionLink } from "@/components/animation/page-transition";
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
  const list = items ?? [];
  const lineup = list.slice(0, 4);
  const [slug, setSlug] = useState<string | undefined>(
    list.find((p) => p.featured)?.slug ?? list[0]?.slug,
  );
  const [dir, setDir] = useState(1);
  const active = list.find((p) => p.slug === slug) ?? list[0];
  const reduce = useReducedMotion();

  // Restore the case study you came back from (stored by navigate).
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const last = sessionStorage.getItem(LAST_PROJECT_KEY);
        if (!last || last === slug) return;
        const a = list.findIndex((p) => p.slug === slug);
        const b = list.findIndex((p) => p.slug === last);
        if (b < 0) return;
        setDir(b > a ? 1 : -1);
        setSlug(last);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const stageRef = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  // 3D tilt + glare: cursor-tracked, desktop only.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rY = useSpring(useTransform(px, [0, 1], [9, -9]), { stiffness: 180, damping: 20 });
  const rX = useSpring(useTransform(py, [0, 1], [-7, 7]), { stiffness: 180, damping: 20 });
  const gx = useTransform(px, (v) => v * 100);
  const gy = useTransform(py, (v) => v * 100);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.32), transparent 55%)`;
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const tiltOn = !reduce && fine;

  function onTilt(e: MouseEvent) {
    if (!tiltOn || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  function resetTilt() {
    px.set(0.5);
    py.set(0.5);
    setHov(false);
  }

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!visualRef.current || !sectionRef.current) return;
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

  if (!active) {
    return (
      <section id="projects" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-sm text-black/50">
              Some experiments became products. Some products became lessons.
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
              Things I&apos;ve built
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-10 border-2 p-10 text-center">
              <p className="font-mono text-sm font-bold">NOTHING SHIPPED YET.</p>
              <p className="mt-2 font-mono text-xs text-black/50">The next one might be interesting.</p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

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
        <div
          ref={stageRef}
          onMouseMove={onTilt}
          onMouseEnter={() => tiltOn && setHov(true)}
          onMouseLeave={resetTilt}
          className="relative mt-4 [perspective:1200px]"
        >
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
              style={tiltOn ? { rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" } : undefined}
              className="border-ink bg-white shadow-brutal-lg rounded-brutal-lg relative grid overflow-hidden border-2 md:grid-cols-2"
            >
              <div className={cn("relative flex min-h-80 items-center justify-center overflow-hidden p-10 md:min-h-[500px]", active.color)}>
                {active.heroImage ? (
                  <>
                    <Image
                      src={active.heroImage}
                      alt={`${active.title} preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="border-ink bg-cream relative rounded-full border-2 px-4 py-1.5 font-mono text-xs font-bold">
                      {active.title}
                    </span>
                  </>
                ) : (
                  <span ref={visualRef} className="text-center font-mono text-4xl font-bold md:text-6xl">
                    {active.visual}
                  </span>
                )}
              </div>
              <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
                <p className="font-mono text-xs font-bold text-black/40">
                  {active.featured ? "★ FEATURED PROJECT" : "PROJECT"}
                </p>
                <h3 className="text-3xl font-bold tracking-tight md:text-5xl">{active.title}</h3>
                <p className="max-w-md text-black/70">{active.desc}</p>
                <TechRow tech={active.tech} />
                <div className="mt-2 flex flex-wrap gap-3">
                  <TransitionLink href={`/projects/${active.slug}`} title={active.title} data-cursor="VIEW" data-track={`case_open:${active.slug}`}>
                    <Button className="font-mono">
                      CASE STUDY <ArrowRight size={16} />
                    </Button>
                  </TransitionLink>
                  {active.githubUrl && (
                    <a href={active.githubUrl} target="_blank" rel="noreferrer" data-track={`outbound:${active.slug}-github`}>
                      <Button variant="neutral" className="font-mono">
                        <ArrowUpRight size={16} /> GITHUB
                      </Button>
                    </a>
                  )}
                  {active.liveUrl && (
                    <a href={active.liveUrl} target="_blank" rel="noreferrer" data-track={`outbound:${active.slug}-live`}>
                      <Button variant="neutral" className="font-mono">
                        <ArrowUpRight size={16} /> LIVE
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              {tiltOn && (
                <motion.div
                  aria-hidden
                  animate={{ opacity: hov ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ background: glare }}
                  className="pointer-events-none absolute inset-0"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
