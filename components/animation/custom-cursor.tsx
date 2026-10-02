"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setEnabled(true);
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
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

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
        <span
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
        </span>
      </motion.div>
    </motion.div>
  );
}
