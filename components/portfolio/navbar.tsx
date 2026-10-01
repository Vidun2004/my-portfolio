"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "BUILD", href: "#about" },
  { label: "STACK", href: "#skills" },
  { label: "WORK", href: "#projects" },
  { label: "JOURNEY", href: "#experience" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-4 py-3 transition-all duration-300",
          scrolled
            ? "border-ink bg-white/90 shadow-brutal rounded-brutal-md border-2 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <a
          href="#home"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="border-ink bg-brand-blue shadow-brutal flex size-8 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold">
            {"{ }"}
          </span>
          VIDUN.DEV
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 font-mono text-sm font-medium transition-colors hover:bg-black/5"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact">
            <Button size="sm" className="bg-brand-yellow ml-2 font-mono">
              SAY HI
            </Button>
          </a>
        </div>

        <button
          className="border-ink bg-white rounded-lg border-2 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="border-ink bg-white shadow-brutal rounded-brutal-md mx-auto mt-2 max-w-6xl border-2 p-2 md:hidden"
          >
            {[...LINKS, { label: "SAY HI", href: "#contact" }].map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 font-mono text-sm font-bold hover:bg-black/5"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
