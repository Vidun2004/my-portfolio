"use client";

import { motion, useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import { useEffect, useState } from "react";

const SEEN_KEY = "vidun-splash-seen";

/**
 * Landing splash in the rubber-stamp language: solid ink backdrop with
 * a tilted brutalist stamp card, lifting away with the same 0.55s wipe
 * as the page transition. Once per session, skipped on reduced motion.
 *
 * Editing override: `/?splash=1` forces it every reload, `/?splash=0`
 * suppresses it, `/?splash=stay` pins it (click or Escape lifts).
 */
export function SplashScreen() {
  const reduce = useReducedMotion();
  // Always false on first render so server + client match (no hydration
  // mismatch). Decided client-side in the effect below.
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [forced, setForced] = useState(false);
  const [stay, setStay] = useState(false);

  // Decide after mount whether to show (once per session, or forced).
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => {
      const flag = new URLSearchParams(window.location.search).get("splash");
      if (flag === "0" || flag === "false") return;
      if (flag === "stay") {
        setForced(true);
        setStay(true);
        setShow(true);
        return;
      }
      if (flag === "1" || flag === "true" || flag === "force") {
        setForced(true);
        setShow(true);
        return;
      }
      try {
        if (sessionStorage.getItem(SEEN_KEY)) return;
      } catch {
        return;
      }
      setShow(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce || !show) return;
    window.scrollTo(0, 0);
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    // Stay mode pins the splash for editing — lift manually.
    if (stay) return;

    const lift = window.setTimeout(() => setLeaving(true), 950);
    return () => window.clearTimeout(lift);
  }, [reduce, show, stay]);

  // Stay mode: Escape lifts the curtain to preview the exit animation.
  useEffect(() => {
    if (!stay || !show || leaving) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLeaving(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stay, show, leaving]);

  if (!show || reduce) return null;

  function onLiftDone() {
    if (!leaving) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.start();
    document.body.style.overflow = "";
    // Forced replays shouldn't mark the session as seen.
    if (!forced) {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    setShow(false);
    setLeaving(false);
  }

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[160]"
      onClick={stay && !leaving ? () => setLeaving(true) : undefined}
    >
      <motion.div
        initial={{ y: "0%" }}
        animate={{ y: leaving ? "-100%" : "0%" }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={onLiftDone}
        className="bg-ink absolute inset-0 flex items-center justify-center px-6"
      >
        <motion.div
          initial={{ scale: 2.4, rotate: -4, opacity: 0 }}
          animate={{ scale: 1, rotate: -4, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="border-ink bg-cream shadow-brutal-lg rounded-brutal-lg max-w-md border-[3px] px-8 py-6 text-center"
        >
          <p className="border-ink bg-brand-yellow inline-block rounded-full border-2 px-3 py-0.5 font-mono text-[11px] font-bold tracking-widest">
            PORTFOLIO 2026
          </p>
          <p className="mt-3 font-mono text-3xl font-bold uppercase md:text-5xl">
            {"{ vidun.dev }"}
          </p>
          <p className="mt-4 font-mono text-xs text-black/60 md:text-sm">
            $ loading portfolio
            <span className="bg-ink ml-1 inline-block h-3.5 w-2 animate-pulse align-middle" />
          </p>
          <div className="border-ink mx-auto mt-3 h-2.5 w-48 overflow-hidden rounded-full border-2 bg-white md:w-64">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: leaving ? "100%" : stay ? "100%" : "85%" }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="bg-brand-yellow h-full"
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t-2 border-dashed border-ink/30 pt-3">
            <span className="font-mono text-[10px] font-bold tracking-widest text-black/60">
              ADMIT ONE ✦ VIDUN.DEV
            </span>
            <span className="flex h-5 items-stretch gap-[2px]" aria-hidden>
              {[3, 1, 2, 1, 4, 1, 2].map((w, i) => (
                <span key={i} className="bg-ink" style={{ width: w }} />
              ))}
            </span>
          </div>
          {stay && !leaving && (
            <p className="mt-3 font-mono text-[11px] tracking-widest text-black/40">
              STAY MODE — CLICK / ESC TO LIFT
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
