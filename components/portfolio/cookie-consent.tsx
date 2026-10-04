"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cookie } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";

/**
 * Consent banner. Appears once per browser until a choice is made;
 * re-openable any time via the `vidun:cookie-settings` window event
 * (footer COOKIES link). No tracking runs before ACCEPT.
 */
export function CookieConsent() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!getConsent()) setOpen(true);
    }, 1200);
    function reopen() {
      setOpen(true);
    }
    window.addEventListener("vidun:cookie-settings", reopen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("vidun:cookie-settings", reopen);
    };
  }, []);

  const decide = useCallback((value: "accepted" | "declined") => {
    setConsent(value);
    setOpen(false);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 48 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          role="dialog"
          aria-label="Cookie consent"
          className="border-ink bg-white shadow-brutal-lg rounded-brutal-lg fixed bottom-4 left-4 z-[125] w-[calc(100vw-2rem)] max-w-sm border-2 p-4 md:bottom-6 md:left-6"
        >
          <p className="flex items-center gap-2 font-mono text-xs font-bold">
            <Cookie size={16} /> COOKIES, HONESTLY
          </p>
          <p className="mt-2 text-sm text-black/70">
            Essential cookies keep the admin signed in. Analytics cookies count
            visits — only if you accept. No ads, no third parties, ever.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => decide("accepted")}
              className="border-ink bg-brand-yellow flex-1 rounded-lg border-2 px-3 py-2 font-mono text-xs font-bold transition-transform hover:-translate-y-0.5"
            >
              ACCEPT ANALYTICS
            </button>
            <button
              onClick={() => decide("declined")}
              className="flex-1 rounded-lg border-2 border-ink bg-white px-3 py-2 font-mono text-xs font-bold transition-transform hover:-translate-y-0.5"
            >
              ESSENTIAL ONLY
            </button>
          </div>
          <a href="/privacy" className="mt-2 block font-mono text-[11px] font-bold text-black/50 hover:underline">
            Privacy details →
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
