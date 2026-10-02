"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "home", label: "HOME" },
  { id: "build", label: "BUILD" },
  { id: "about", label: "ABOUT" },
  { id: "skills", label: "STACK" },
  { id: "projects", label: "WORK" },
  { id: "experience", label: "JOURNEY" },
  { id: "contact", label: "SAY HI" },
];

export function ScrollDots() {
  const [active, setActive] = useState("home");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    // only show once hero is scrolled past a bit
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col gap-2.5 transition-opacity duration-300 md:flex",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          className="group flex items-center justify-end"
        >
          <span className="border-ink pointer-events-none mr-2 hidden rounded-md border-2 bg-white px-2 py-0.5 font-mono text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100">
            {s.label}
          </span>
          <span
            className={cn(
              "border-ink block size-3 rounded-full border-2 transition-all duration-300",
              active === s.id
                ? "scale-125 bg-ink"
                : "bg-white hover:scale-110 hover:bg-brand-yellow",
            )}
          />
        </a>
      ))}
    </nav>
  );
}
