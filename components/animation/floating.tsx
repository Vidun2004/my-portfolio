"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type FloatingProps = {
  children: ReactNode;
  className?: string;
  /** vertical float distance in px */
  distance?: number;
  duration?: number;
  delay?: number;
  rotate?: number;
};

/** Subtle continuous float for decorative stickers. */
export function Floating({
  children,
  className,
  distance = 8,
  duration = 3.5,
  delay = 0,
  rotate = 0,
}: FloatingProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={
        rotate
          ? { y: [0, -distance, 0], rotate: [-rotate, rotate, -rotate] }
          : { y: [0, -distance, 0] }
      }
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
