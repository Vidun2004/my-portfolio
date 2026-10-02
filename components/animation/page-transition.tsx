"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import type Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Cover = { href: string; title: string; hash: string | null };

const TransitionContext = createContext<(href: string, title: string) => void>(() => {});

export const useTransitionNav = () => useContext(TransitionContext);

function scrollAfterNav(hash: string | null) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (hash) {
    const el = document.querySelector(hash);
    if (el && lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: -88, duration: 1.2 });
      return;
    }
    if (el) {
      el.scrollIntoView();
      return;
    }
  }
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/**
 * Brutalist curtain wipe between pages: yellow + ink panels slam up
 * with the destination title, then lift away on arrival.
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
      const hash = pending.current?.hash ?? null;
      pending.current = null;
      // let the new page paint under the curtain first
      requestAnimationFrame(() => {
        scrollAfterNav(hash);
        setCover(null);
        setLeaving(false);
      });
    }
  }

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <AnimatePresence>
        {cover && (
          <div key="wipe" className="pointer-events-none fixed inset-0 z-[150]">
            <motion.div
              aria-hidden
              initial={{ y: "100%" }}
              animate={{ y: leaving ? "-100%" : "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
              onAnimationComplete={onCoverDone}
              className="bg-brand-yellow absolute inset-0"
            />
            <motion.div
              aria-hidden
              initial={{ y: "100%" }}
              animate={{ y: leaving ? "-100%" : "0%" }}
              transition={{ duration: 0.55, delay: leaving ? 0.06 : 0.09, ease: [0.76, 0, 0.24, 1] }}
              className="bg-ink absolute inset-0 flex items-center justify-center"
            >
              <div className="px-6 text-center">
                <p className="font-mono text-xs font-bold tracking-[0.3em] text-brand-yellow">
                  OPENING CASE STUDY
                </p>
                <p className="text-cream mt-2 font-mono text-3xl font-bold uppercase md:text-5xl">
                  {"{ "}
                  {cover.title}
                  {" }"}
                </p>
              </div>
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
