"use client";

import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
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
  const featured = list.find((p) => p.featured) ?? list[0];
  const rest = list.filter((p) => p.slug !== featured.slug);
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

  return (
    <section ref={sectionRef} id="projects" className="w-full border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-sm text-black/50">
            Some experiments became products. Some products became lessons.
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
            Things I&apos;ve built
          </h2>
        </Reveal>

        {/* Featured */}
        <Reveal delay={0.1}>
          <a
            href={`/projects/${featured.slug}`}
            className="border-ink bg-white shadow-brutal rounded-brutal-lg group mt-12 block overflow-hidden border-2 transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg"
          >
            <div className={cn("flex min-h-[280px] items-center justify-center overflow-hidden border-b-2 border-ink p-10 md:min-h-[360px]", featured.color)}>
              <span ref={visualRef} className="font-mono text-4xl font-bold transition-transform duration-500 group-hover:scale-[1.03] md:text-6xl">
                {featured.visual}
              </span>
            </div>
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="font-mono text-xs font-bold text-black/40">FEATURED PROJECT</p>
                <h3 className="mt-1 text-3xl font-bold md:text-4xl">{featured.title}</h3>
                <p className="mt-2 max-w-xl text-black/70">{featured.desc}</p>
                <div className="mt-4">
                  <TechRow tech={featured.tech} />
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button className="font-mono">
                  CASE STUDY <ArrowRight size={16} />
                </Button>
                <Button variant="neutral" className="font-mono">
                  <ArrowUpRight size={16} /> GITHUB
                </Button>
              </div>
            </div>
          </a>
        </Reveal>

        {/* Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={0.1 + i * 0.08}>
              <a
                href={`/projects/${p.slug}`}
                className="border-ink bg-white shadow-brutal rounded-brutal-md group flex h-full flex-col overflow-hidden border-2 transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg"
              >
                <div className={cn("flex h-44 items-center justify-center overflow-hidden border-b-2 border-ink", p.color)}>
                  <span className="font-mono text-2xl font-bold transition-transform duration-500 group-hover:scale-[1.03]">
                    {p.visual}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-black/70">{p.desc}</p>
                  <div className="mt-4">
                    <TechRow tech={p.tech} />
                  </div>
                  <span className="mt-4 flex items-center gap-1 font-mono text-xs font-bold opacity-60 transition-opacity group-hover:opacity-100">
                    VIEW CASE STUDY <ExternalLink size={14} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
