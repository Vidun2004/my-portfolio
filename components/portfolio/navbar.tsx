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
    <>
      {/* Topbar: mobile + tablet only */}
      <motion.header
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 lg:hidden"
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

          <button
            className="border-ink bg-white rounded-lg border-2 p-2"
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
              className="border-ink bg-white shadow-brutal rounded-brutal-md mx-auto mt-2 max-w-6xl border-2 p-2"
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

      {/* Left rail: desktop only */}
      <motion.aside
        initial={reduce ? false : { x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="border-ink fixed top-0 left-0 z-50 hidden h-svh w-20 flex-col items-center border-r-2 bg-cream py-5 lg:flex"
      >
        <a
          href="#home"
          aria-label="Back to top"
          className="border-ink bg-brand-blue shadow-brutal flex size-10 items-center justify-center rounded-xl border-2 font-mono text-sm font-bold transition-transform hover:-translate-y-0.5"
        >
          {"{ }"}
        </a>

        <span aria-hidden className="bg-ink/15 my-4 h-px w-10" />

        <nav className="flex flex-1 flex-col items-center justify-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-2 py-3 font-mono text-xs font-bold tracking-[0.2em] transition-colors hover:bg-ink hover:text-cream [writing-mode:vertical-rl] rotate-180"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="border-ink bg-brand-yellow shadow-brutal rounded-xl border-2 px-2 py-3 font-mono text-xs font-bold tracking-[0.2em] transition-transform [writing-mode:vertical-rl] rotate-180 hover:-translate-y-0.5"
        >
          SAY HI
        </a>
      </motion.aside>
    </>
  );
}
