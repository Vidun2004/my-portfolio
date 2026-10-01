"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { MouseEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Floating } from "@/components/animation/floating";

/**
 * Hero recreating UI_Ref.webp layout:
 * left = headline + CTAs, right = profile composition + floating dev stickers.
 * Mouse parallax is desktop-only, max ~12px, disabled on reduced motion.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 150, damping: 20, mass: 0.5 });

  // Parallax layers: subtle, different depths
  const layer1x = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const layer1y = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const layer2x = useTransform(sx, [-0.5, 0.5], [8, -8]);
  const layer2y = useTransform(sy, [-0.5, 0.5], [6, -6]);

  function onMouseMove(e: MouseEvent) {
    if (reduce || !ref.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  const enter = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden pt-28 pb-16 md:pt-32"
    >
      {/* subtle full-screen background decor */}
      <div
        aria-hidden
        className="border-ink bg-brand-teal/20 absolute top-32 -left-16 size-48 rounded-full border-2"
      />
      <div
        aria-hidden
        className="border-ink bg-brand-pink/20 absolute bottom-10 -right-16 size-56 rounded-full border-2"
      />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
        {/* Left */}
        <div>
          <motion.div {...enter(0.2)}>
            <Badge className="bg-success font-mono">
              <span className="mr-1 inline-block size-2 animate-pulse rounded-full bg-black" />
              available for work
            </Badge>
          </motion.div>
          <motion.p
            {...enter(0.3)}
            className="mt-6 font-mono text-sm text-black/60"
          >
            Hi, my name is Vidun.
          </motion.p>
          <motion.h1
            {...enter(0.35)}
            className="mt-2 text-5xl leading-[0.95] font-bold tracking-tight uppercase md:text-7xl"
          >
            I build
            <br />
            software
            <br />
            that works.
          </motion.h1>
          <motion.p {...enter(0.45)} className="mt-6 max-w-md text-base md:text-lg">
            Software Engineering student building web applications, mobile
            apps, systems and experimental products.
          </motion.p>
          <motion.div {...enter(0.55)} className="mt-8 flex flex-wrap gap-4">
            <a href="#projects">
              <Button size="lg" className="bg-brand-yellow font-mono">
                EXPLORE MY WORK <ArrowRight size={18} />
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="neutral" className="font-mono">
                LET&apos;S TALK
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Right visual composition */}
        <motion.div
          {...enter(0.7)}
          className="relative mx-auto w-full max-w-md"
        >
          {/* Name pill — absolute positioning lives on the parallax element itself
              so transform never changes the containing block for children */}
          <motion.div
            style={reduce ? undefined : { x: layer2x, y: layer2y }}
            className="absolute -top-8 -right-2 z-20 md:-right-8"
          >
            <Floating distance={8} duration={3.2}>
              <div className="border-ink bg-brand-blue shadow-brutal rounded-brutal-md border-2 px-5 py-2 text-2xl font-bold">
                Vidun
              </div>
            </Floating>
          </motion.div>

          {/* Main card */}
          <motion.div style={reduce ? undefined : { x: layer1x, y: layer1y }}>
            <div className="border-ink bg-brand-pink shadow-brutal-lg rounded-brutal-lg relative overflow-hidden border-2">
              <div className="bg-ink text-cream flex items-center justify-between px-4 py-2 font-mono text-xs">
                <span>{"{ vidun.dev }"}</span>
                <span className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-yellow-400" />
                  <span className="size-2.5 rounded-full bg-green-400" />
                </span>
              </div>
              <div className="flex min-h-[320px] flex-col items-start justify-end gap-2 bg-white p-6">
                <p className="font-mono text-xs text-black/50">
                  {"// profile.tsx"}
                </p>
                <p className="font-mono text-2xl font-bold">
                  {"<Developer />"}
                </p>
                <p className="font-mono text-sm text-black/60">
                  web • mobile • systems • games
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["TypeScript", "Next.js", "Supabase"].map((t) => (
                    <span
                      key={t}
                      className="border-ink rounded-full border-2 bg-cream px-3 py-1 font-mono text-xs font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating stickers — each sticker owns its absolute position +
              parallax transform, so hovering never re-parents the layout */}
          <motion.div
            style={reduce ? undefined : { x: layer2x, y: layer2y }}
            className="absolute top-16 -left-4 md:-left-10"
          >
            <Floating distance={10} duration={4} delay={0.4} rotate={4}>
              <div className="border-ink bg-brand-teal shadow-brutal rounded-brutal-md flex items-center gap-1 border-2 px-3 py-2 font-mono text-sm font-bold">
                {"</>"}
              </div>
            </Floating>
          </motion.div>
          <motion.div
            style={reduce ? undefined : { x: layer2x, y: layer2y }}
            className="absolute -bottom-6 left-8"
          >
            <Floating distance={7} duration={3} delay={0.8}>
              <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 px-3 py-1.5 font-mono text-xs font-bold">
                git • API • DB
              </div>
            </Floating>
          </motion.div>
          <motion.div
            style={reduce ? undefined : { x: layer2x, y: layer2y }}
            className="absolute top-1/2 -right-4 md:-right-8"
          >
            <Floating distance={9} duration={3.8} delay={0.2} rotate={3}>
              <div className="border-ink bg-brand-yellow shadow-brutal flex size-14 items-center justify-center rounded-full border-2 font-mono text-lg font-bold">
                01
              </div>
            </Floating>
          </motion.div>

          {/* Status pill */}
          <Floating
            className="absolute -bottom-4 right-4"
            distance={6}
            duration={2.8}
            delay={1}
          >
            <div className="border-ink bg-success rounded-full border-2 px-3 py-1 font-mono text-xs font-bold">
              ● Available for freelance
            </div>
          </Floating>
        </motion.div>
      </div>
    </section>
  );
}
