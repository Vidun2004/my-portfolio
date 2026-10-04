"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type Lenis from "lenis";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "BUILD", href: "#about", n: "01" },
  { label: "STACK", href: "#skills", n: "02" },
  { label: "WORK", href: "#projects", n: "03" },
  { label: "JOURNEY", href: "#experience", n: "04" },
];

const ALL = [...LINKS, { label: "SAY HI", href: "#contact", n: "05" }];

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

  // Lock scroll while the full-screen menu is open.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [open]);

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
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Full-screen menu takeover: mobile + tablet only */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: "-4%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-4%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-cream fixed inset-0 z-40 flex flex-col justify-center px-8 lg:hidden"
          >
            <p className="font-mono text-xs font-bold tracking-widest text-black/40">
              VIDUN.DEV — PICK A SECTION
            </p>
            <nav className="mt-4 flex flex-col">
              {ALL.map((l, i) => (
                <motion.a
                  key={l.href + l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: reduce ? 0 : 0.08 + i * 0.06 }}
                  className={cn(
                    "group flex items-baseline gap-4 border-b-2 border-dashed border-ink/20 py-4",
                    l.label === "SAY HI" && "border-none",
                  )}
                >
                  <span className="font-mono text-sm font-bold text-black/40">{l.n}</span>
                  <span
                    className={cn(
                      "text-5xl font-bold tracking-tight uppercase transition-all group-hover:-translate-y-0.5",
                      l.label === "SAY HI" &&
                        "border-ink bg-brand-yellow shadow-brutal rounded-brutal-md mt-2 border-2 px-5 py-2",
                    )}
                  >
                    {l.label}
                  </span>
                </motion.a>
              ))}
            </nav>
            <p className="mt-8 font-mono text-[11px] font-bold tracking-widest text-black/40">
              {"{ built with curiosity }"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
