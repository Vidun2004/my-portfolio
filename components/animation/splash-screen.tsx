"use client";

import { motion, useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import { useEffect, useState } from "react";

const SEEN_KEY = "vidun-splash-seen";

/**
 * Landing splash reusing the case-study curtain method:
 * yellow + ink panels start covered, then lift with the same
 * 0.55s brutalist wipe. Once per session, skipped on reduced motion.
 *
 * Editing override: visit `/?splash=1` to force it on every reload,
 * `/?splash=0` to suppress it, `/?splash=stay` to pin it on screen
 * (click or Escape lifts it) while editing.
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
        className="bg-brand-yellow absolute inset-0"
      />
      <motion.div
        initial={{ y: "0%" }}
        animate={{ y: leaving ? "-100%" : "0%" }}
        transition={{ duration: 0.55, delay: 0.06, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={onLiftDone}
        className="bg-ink absolute inset-0 flex items-center justify-center"
      >
        <div className="px-6 text-center">
          <p className="text-cream mt-2 font-mono text-3xl font-bold uppercase md:text-5xl">
            {"{ vidun.dev }"}
          </p>
          <p className="text-cream/60 mt-4 font-mono text-xs md:text-sm">
            $ loading portfolio
            <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-brand-yellow align-middle" />
          </p>
          <div className="border-cream/30 mx-auto mt-3 h-2 w-48 overflow-hidden rounded-full border-2 md:w-64">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: leaving ? "100%" : stay ? "100%" : "85%" }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="bg-brand-yellow h-full"
            />
          </div>
          {stay && !leaving && (
            <p className="text-cream/40 mt-4 font-mono text-[11px] tracking-widest">
              STAY MODE — CLICK / ESC TO LIFT
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
