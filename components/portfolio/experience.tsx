"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Plane, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/animation/reveal";
import { Badge } from "@/components/ui/badge";
import type { JourneyStep } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BARS = [3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1];

function shortRole(role: string): string {
  return role.length > 14 ? role.split(" ").slice(0, 2).join(" ") : role;
}

function TicketFace({
  s,
  i,
  from,
  enlarged,
}: {
  s: JourneyStep;
  i: number;
  from: string;
  enlarged?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-ink bg-white shadow-brutal rounded-brutal-md relative flex items-stretch border-2",
        !enlarged &&
          "transition-all duration-300 hover:rotate-0 hover:shadow-brutal-lg",
        !enlarged && (i % 2 ? "rotate-1" : "-rotate-1"),
        enlarged && "shadow-brutal-lg",
      )}
    >
      {/* main stub */}
      <div className={cn("flex-1", enlarged ? "p-7 md:p-9" : "p-5 md:p-6")}>
        <div className="flex items-center gap-3 font-mono text-xs font-bold">
          <span className="text-black/40">{from}</span>
          <span aria-hidden>✈ ───</span>
          <span className={cn("rounded border-2 border-ink px-2 py-0.5", s.color)}>
            {enlarged ? s.role : shortRole(s.role)}
          </span>
          {i === 0 && (
            <span className="bg-ink text-cream rounded-full px-2 py-0.5 text-[11px]">
              ● ONBOARD
            </span>
          )}
        </div>
        <h3
          className={cn(
            "mt-2 font-bold",
            enlarged ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl",
          )}
        >
          {s.role}
        </h3>
        <p className={cn("mt-1 text-black/70", enlarged ? "text-base" : "text-sm")}>
          {s.desc}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {s.tech.map((t) => (
            <Badge key={t} variant="neutral" className="font-mono text-[11px]">
              {t}
            </Badge>
          ))}
        </div>
        <div
          className={cn(
            "mt-4 flex font-mono font-bold text-black/50",
            enlarged ? "gap-10 text-sm" : "gap-6 text-xs",
          )}
        >
          <span>DATE<span className={cn("block text-ink", enlarged ? "text-lg" : "text-sm")}>{s.year}</span></span>
          <span>GATE<span className={cn("block text-ink", enlarged ? "text-lg" : "text-sm")}>G{i + 1}</span></span>
          <span>SEAT<span className={cn("block text-ink", enlarged ? "text-lg" : "text-sm")}>{s.year.slice(2)}{"ABCDEF"[i % 6]}</span></span>
        </div>
      </div>

      {/* perforation */}
      <div aria-hidden className="relative w-6 shrink-0 border-l-2 border-dashed border-ink/40">
        <span className="bg-cream absolute -top-3.5 -left-3.5 size-6 rounded-full" />
        <span className="bg-cream absolute -bottom-3.5 -left-3.5 size-6 rounded-full" />
      </div>

      {/* barcode stub */}
      <div className="hidden w-28 shrink-0 flex-col items-center justify-center gap-2 p-4 sm:flex">
        <div className={cn("flex items-stretch gap-[2px]", enlarged ? "h-16" : "h-12")}>
          {BARS.map((w, b) => (
            <span key={b} className="bg-ink" style={{ width: w }} />
          ))}
        </div>
        <span className="font-mono text-[10px] font-bold tracking-widest">ADMIT ONE</span>
      </div>
    </div>
  );
}

export function Experience({ steps }: { steps?: JourneyStep[] }) {
  const items = steps ?? [];

  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [stampKey, setStampKey] = useState(0);
  const [dir, setDir] = useState(1);
  const lastIdx = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  // Lock scroll + close on Escape while inspecting.
  useEffect(() => {
    if (open === null) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open ]);

  // Pinned scroll stage only on large fine-pointer screens.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const pinned = !reduce && isDesktop && items.length > 0;

  useGSAP(
    () => {
      if (!pinned || !stageRef.current) return;
      const len = items.length;
      const st = ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: () => `+=${len * window.innerHeight}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          progress.set(self.progress);
          const idx = Math.min(len - 1, Math.floor(self.progress * len));
          if (idx !== lastIdx.current) {
            setDir(idx > lastIdx.current ? 1 : -1);
            lastIdx.current = idx;
            setStageIdx(idx);
            setStampKey((k) => k + 1);
          }
        },
      });
      return () => {
        st.kill();
      };
    },
    { scope: sectionRef, dependencies: [pinned, items.length] },
  );

  if (items.length === 0) {
    return (
      <section id="experience" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-sm text-black/50">
              Where I&apos;ve been, what I&apos;ve learned, and what I&apos;m building next.
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
              The journey
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-ink bg-white shadow-brutal rounded-brutal-md mx-auto mt-12 max-w-4xl border-2 p-10 text-center">
              <p className="font-mono text-sm font-bold">JOURNEY NOT LOGGED YET.</p>
              <p className="mt-2 font-mono text-xs text-black/50">Stops are added from the admin panel.</p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  const active = open !== null ? items[open] : null;
  const morph = !reduce && !pinned;

  return (
    <section ref={sectionRef} id="experience" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
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

        {/* Pinned scroll stage (desktop): one ticket per screen, stamped on arrival */}
        {pinned ? (
          <div ref={stageRef} className="relative mt-6 flex h-svh flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-4 left-1/2 w-60 -translate-x-1/2">
              <p className="text-center font-mono text-xs font-bold tracking-widest">
                {String(stageIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} — SCROLL ↓
              </p>
              <div className="border-ink mt-2 h-2.5 overflow-hidden rounded-full border-2 bg-white">
                <motion.div style={{ scaleX: progress }} className="bg-brand-yellow h-full origin-left" />
              </div>
            </div>

            <div className="relative w-full max-w-2xl px-6">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={stageIdx}
                  initial={{ opacity: 0, x: 90 * dir }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -70 * dir }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${items[stageIdx].role} ticket`}
                    data-cursor="VIEW"
                    onClick={() => setOpen(stageIdx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen(stageIdx);
                      }
                    }}
                    className="cursor-pointer rounded-brutal-md outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    <TicketFace
                      s={items[stageIdx]}
                      i={stageIdx}
                      from={items[stageIdx + 1] ? shortRole(items[stageIdx + 1].role) : "CURIOSITY"}
                      enlarged
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
              <motion.div
                key={`stamp-${stageIdx}-${stampKey}`}
                aria-hidden
                initial={{ scale: 2.2, rotate: 8, opacity: 0 }}
                animate={{ scale: 1, rotate: 6, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 19, delay: 0.3 }}
                className="border-ink bg-success shadow-brutal absolute -right-3 -bottom-5 rounded-md border-[3px] px-4 py-1.5 font-mono text-lg font-bold tracking-widest"
              >
                ✓ APPROVED
              </motion.div>
            </div>
          </div>
        ) : (
        <div className="mx-auto mt-12 max-w-4xl space-y-6">
          {items.map((s, i) => {
            const from = items[i + 1] ? shortRole(items[i + 1].role) : "CURIOSITY";
            const id = `journey-${s.year}-${i}`;
            return (
              <Reveal key={s.year + s.role} delay={i * 0.06}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ${s.role} ticket`}
                  data-cursor="VIEW"
                  onClick={() => setOpen(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpen(i);
                    }
                  }}
                  className={cn(
                    "cursor-pointer rounded-brutal-md outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                    open === i && "invisible",
                  )}
                >
                  {reduce || pinned ? (
                    <TicketFace s={s} i={i} from={from} />
                  ) : (
                    <motion.div layoutId={id}>
                      <TicketFace s={s} i={i} from={from} />
                    </motion.div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
        )}
      </div>

      {/* Inspection overlay — ticket morphs here via shared layoutId */}
      <AnimatePresence>
        {active && open !== null && (
          <div key="inspect" className="fixed inset-0 z-[140] flex items-center justify-center p-6">
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(null)}
              className="bg-ink/60 absolute inset-0 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-4xl">
              {!morph ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <TicketFace
                    s={active}
                    i={open}
                    from={items[open + 1] ? shortRole(items[open + 1].role) : "CURIOSITY"}
                    enlarged
                  />
                </motion.div>
              ) : (
                <motion.div
                  layoutId={`journey-${active.year}-${open}`}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                >
                  <TicketFace
                    s={active}
                    i={open}
                    from={items[open + 1] ? shortRole(items[open + 1].role) : "CURIOSITY"}
                    enlarged
                  />
                </motion.div>
              )}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(null)}
                autoFocus
                aria-label="Close ticket inspection"
                className="border-ink bg-brand-pink shadow-brutal rounded-full absolute -top-4 -right-4 flex size-11 items-center justify-center border-2 transition-transform hover:rotate-90"
              >
                <X size={20} strokeWidth={3} />
              </motion.button>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-cream/70 mt-4 text-center font-mono text-xs font-bold tracking-widest"
              >
                ESC / TAP OUTSIDE TO RETURN
              </motion.p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
