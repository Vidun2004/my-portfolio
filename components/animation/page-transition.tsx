"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import type Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Cover = { href: string; title: string; hash: string | null };

export const LAST_PROJECT_KEY = "vidun-last-project";

const TransitionContext = createContext<(href: string, title: string) => void>(() => {});

export const useTransitionNav = () => useContext(TransitionContext);

function scrollToHash(hash: string, attempts = 0) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const el = document.querySelector(hash);
  if (el) {
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -88, duration: 1.2 });
    else el.scrollIntoView();
    return;
  }
  // Home sections may not be painted yet when arriving cross-page —
  // retry briefly instead of dropping to the top.
  if (attempts < 40) {
    window.setTimeout(() => scrollToHash(hash, attempts + 1), 50);
    return;
  }
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

function scrollAfterNav(hash: string | null) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (hash) {
    scrollToHash(hash);
    return;
  }
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/**
 * Rubber-stamp slam between pages: ink dims the old page, then a tilted
 * brutalist stamp card slams in with the destination title, holds, and
 * rides the overlay up on arrival.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [cover, setCover] = useState<Cover | null>(null);
  const [leaving, setLeaving] = useState(false);
  const pending = useRef<Cover | null>(null);

  const navigate = useCallback(
    (href: string, title: string) => {
      if (reduce) {
        router.push(href);
        return;
      }
      const hash = href.includes("#") ? `#${href.split("#")[1]}` : null;
      const clean = hash ? href.split("#")[0] || pathname : href;
      if (clean === pathname && !hash) return;
      if (clean === pathname && hash) {
        scrollAfterNav(hash);
        return;
      }
      // Remember the case study being opened so the lineup can
      // restore it when coming back to /#projects.
      const caseMatch = href.match(/^\/projects\/([^/#?]+)/);
      if (caseMatch) {
        try {
          sessionStorage.setItem(LAST_PROJECT_KEY, caseMatch[1]);
        } catch {
          /* ignore */
        }
      }
      pending.current = { href, title, hash };
      setLeaving(false);
      setCover(pending.current);
    },
    [reduce, router, pathname],
  );

  // arrival: lift the curtain
  useEffect(() => {
    if (pending.current && cover) setLeaving(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function onCoverDone() {
    if (!cover) return;
    if (!leaving) {
      router.push(cover.href);
    } else {
      // Completion fires twice (lift + exit) — only the first may act;
      // a second firing must not scroll to top with a consumed pending.
      if (!pending.current) return;
      const hash = pending.current.hash;
      pending.current = null;
      // Let the new page paint under the curtain first. Cross-page hash
      // scrolling is owned by HashRestorer on home (mount-guaranteed);
      // here only reset to top for hash-less arrivals.
      window.setTimeout(() => {
        if (!hash) scrollAfterNav(null);
        setCover(null);
        setLeaving(false);
      }, 80);
    }
  }

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <AnimatePresence>
        {cover && (
          <div key="stamp" className="pointer-events-none fixed inset-0 z-[150]">
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: leaving ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-ink absolute inset-0"
            />
            <motion.div
              aria-hidden
              initial={{ y: "100%" }}
              animate={{ y: leaving ? "-100%" : "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
              onAnimationComplete={onCoverDone}
              className="absolute inset-0 flex items-center justify-center px-6"
            >
              <motion.div
                initial={{ scale: 2.4, rotate: -4, opacity: 0 }}
                animate={{ scale: 1, rotate: -4, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.2 }}
                className="border-ink bg-cream shadow-brutal-lg rounded-brutal-lg max-w-lg border-[3px] px-8 py-6 text-center"
              >
                <p className="inline-block rounded-full border-2 border-ink bg-brand-yellow px-3 py-0.5 font-mono text-[11px] font-bold tracking-widest">
                  ● STAMPED FOR
                </p>
                <p className="mt-3 font-mono text-3xl font-bold uppercase md:text-5xl">
                  {cover.title}
                </p>
                <div className="border-ink mt-4 flex items-center justify-between gap-3 border-t-2 border-dashed pt-3">
                  <span className="font-mono text-[10px] font-bold tracking-widest">
                    ADMIT ONE ✦ VIDUN.DEV
                  </span>
                  <span className="flex h-5 items-stretch gap-[2px]" aria-hidden>
                    {[3, 1, 2, 1, 4, 1, 2].map((w, i) => (
                      <span key={i} className="bg-ink" style={{ width: w }} />
                    ))}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

export function TransitionLink({
  href,
  title,
  children,
  ...rest
}: {
  href: string;
  title: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigate = useTransitionNav();
  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        navigate(href, title);
      }}
    >
      {children}
    </a>
  );
}
