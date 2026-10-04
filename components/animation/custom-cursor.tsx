"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { bassLevel } from "@/lib/audio-meter";

/**
 * Neobrutalist custom cursor: ink dot that pops into a labeled
 * yellow badge over interactive elements. Fine pointers only —
 * touch and reduced-motion users keep the native cursor.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [onDark, setOnDark] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [seen, setSeen] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 1200, damping: 60, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 1200, damping: 60, mass: 0.3 });
  const level = useMotionValue(0);
  const pulse = useTransform(level, (v) => 1 + Math.min(1, v) * 0.85);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const t = window.setTimeout(() => setEnabled(true), 0);
    document.documentElement.classList.add("has-custom-cursor");

    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setSeen(true);
      const t = (e.target as HTMLElement).closest?.(
        'a, button, [role="button"], input, textarea, select, [data-cursor]',
      );
      setLabel(t ? t.getAttribute("data-cursor") ?? "" : null);
      setOnDark(!!(e.target as HTMLElement).closest?.("[data-dark-cursor]"));
    }
    function down() {
      setPressed(true);
    }
    function up() {
      setPressed(false);
    }
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    let raf = 0;
    const sample = () => {
      level.set(bassLevel());
      raf = requestAnimationFrame(sample);
    };
    raf = requestAnimationFrame(sample);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y, level]);

  if (!enabled) return null;

  const hovering = label !== null;
  const size = label ? 76 : hovering ? 48 : 14;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[200]"
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          scale: pressed ? 0.85 : 1,
          opacity: seen ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
        className="-translate-x-1/2 -translate-y-1/2"
      >
        <motion.span
          style={{ scale: pulse }}
          className={
            "flex h-full w-full items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold " +
            (label || hovering
              ? "border-ink bg-brand-yellow"
              : onDark
                ? "border-cream bg-brand-yellow"
                : "border-ink bg-ink")
          }
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
