"use client";

import { Quote } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import type { Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";

const COLORS = ["bg-brand-yellow", "bg-brand-blue", "bg-brand-pink", "bg-brand-teal"];
const TILTS = ["-rotate-1", "rotate-1", "-rotate-2"];

/** Social proof strip — funny empty card while quotes are still being collected. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) {
    return (
      <section id="praise" className="flex w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="font-mono text-sm text-black/50">
                Nice things people will say after we ship.
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
                Kind words
              </h2>
            </div>
            <div className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md -rotate-1 border-2 px-4 py-2 font-mono text-sm font-bold">
              ☆☆☆☆☆ PENDING
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-ink bg-white shadow-brutal rounded-brutal-md mx-auto mt-12 max-w-2xl rotate-1 border-2 p-8 text-center">
              <p className="text-2xl font-bold uppercase">No reviews yet — still collecting.</p>
              <p className="mt-3 text-black/70">
                Work with me and your words could live here.
                <span className="mt-1 block font-mono text-xs text-black/50">Coffee bribes accepted.</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }
  return (
    <section id="praise" className="flex w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-sm text-black/50">
              Nice things people said after we shipped.
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
              Kind words
            </h2>
          </div>
          <div className="border-ink bg-brand-teal shadow-brutal rounded-brutal-md rotate-1 border-2 px-4 py-2 font-mono text-sm font-bold">
            ★★★★★ RECEIPTS
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.slice(0, 6).map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 0.08}>
              <figure
                className={cn(
                  "border-ink shadow-brutal rounded-brutal-md flex h-full flex-col border-2 p-6 transition-all duration-300 hover:rotate-0 hover:shadow-brutal-lg",
                  COLORS[i % COLORS.length],
                  TILTS[i % TILTS.length],
                )}
              >
                <Quote size={28} strokeWidth={2.5} className="rotate-180" />
                <blockquote className="mt-3 flex-1 text-lg leading-snug font-bold">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 border-t-2 border-dashed border-ink/30 pt-3 font-mono text-xs font-bold">
                  {t.name.toUpperCase()}
                  {t.role && <span className="block font-normal opacity-70">{t.role}</span>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
