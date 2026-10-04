"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetail } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * Pinned scroll story: the project visual sticks while chapters
 * (problem → solution → features → architecture → lessons) scroll by.
 * Desktop sticky; mobile stacks normally.
 */
export function CaseStory({ project }: { project: ProjectDetail }) {
  const chapters = [
    { label: "PROBLEM", body: project.problem },
    { label: "SOLUTION", body: project.solution },
    { label: "FEATURES", list: project.features },
    { label: "ARCHITECTURE", body: project.architecture },
    { label: "RESULTS", list: project.results, check: true },
    { label: "CHALLENGES", body: project.challenges },
    { label: "LESSONS LEARNED", body: project.lessons },
  ].filter((c) => ("list" in c ? (c.list as string[])?.length : c.body));

  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = refs.current.findIndex((el) => el === e.target);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [chapters.length]);

  return (
    <div className="mt-8">
      <p className="max-w-2xl text-lg text-black/80">{project.overview}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* pinned visual */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className={cn("border-ink shadow-brutal-lg rounded-brutal-lg flex min-h-64 items-center justify-center overflow-hidden border-2 p-10 md:min-h-[420px]", project.color)}>
            <span className="text-center font-mono text-4xl font-bold md:text-6xl">
              {project.visual}
            </span>
          </div>
          <p className="mt-3 hidden font-mono text-xs font-bold tracking-widest lg:block">
            {String(active + 1).padStart(2, "0")} / {chapters[active]?.label} — SCROLL ↓
          </p>
          <div className="mt-4 hidden flex-wrap gap-1.5 lg:flex">
            {project.tech.map((t) => (
              <Badge key={t} variant="neutral" className="font-mono text-xs">{t}</Badge>
            ))}
          </div>
        </div>

        {/* chapters */}
        <div className="flex flex-col gap-6">
          {chapters.map((c, i) => (
            <div
              key={c.label}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={cn(
                "flex min-h-[40vh] flex-col justify-center rounded-brutal-md border-2 p-6 transition-all duration-500 md:min-h-[62vh] md:p-8",
                i === active
                  ? "border-ink bg-white shadow-brutal opacity-100"
                  : "border-ink/15 bg-white/60 opacity-60",
              )}
            >
              <p className="font-mono text-xs font-bold tracking-widest text-black/40">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 text-3xl font-bold uppercase md:text-4xl">{c.label}</h2>
              {"list" in c && (c.list as string[])?.length ? (
                "check" in c ? (
                  <ul className="mt-4 space-y-2.5">
                    {(c.list as string[]).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-black/80">
                        <span className="border-ink bg-success mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-black/80">
                    {(c.list as string[]).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )
              ) : (
                <p className="mt-4 leading-relaxed text-black/80">{(c as { body: string }).body}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
