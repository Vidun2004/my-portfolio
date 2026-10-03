"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

function getLenis() {
  return (window as unknown as { __lenis?: Lenis }).__lenis;
}

/**
 * Owns hash scrolling for the home page. After a cross-page arrival
 * (e.g. BACK TO WORK → /#projects) the section is landed on once
 * mounted — no reliance on the curtain timing. Same-page jumps are
 * already handled by the transition nav / smooth-scroll interceptor.
 *
 * The landing is a plain native jump: Lenis derives element targets as
 * rect.top + its internal scroll position, which can be desynced from
 * the real position after cross-page travel (repeatedly landed ~570px
 * instead of ~4620px). A native-computed number can't be contaminated;
 * Lenis is then resynced through its immediate path so later smooth
 * jumps compute from fresh state. Runs immediately on mount — the
 * lifting curtain covers any flash.
 */
export function HashRestorer() {
  useEffect(() => {
    // Safety net: whatever Lenis believes after an arrival landing, the
    // first real scroll input resyncs it from the true position BEFORE
    // Lenis processes that input (capture beats its bubble listener).
    // Without this the first wheel can glide back to a stale stored
    // position (page snaps to top).
    function resync() {
      const lenis = getLenis();
      if (!lenis) return;
      lenis.stop();
      lenis.start();
    }
    const capture = { capture: true, once: true } as const;
    window.addEventListener("wheel", resync, capture);
    window.addEventListener("touchstart", resync, capture);
    function land(hash: string): boolean {
      let el: Element | null = null;
      try {
        el = document.querySelector(hash);
      } catch {
        return true;
      }
      if (!el) return false;
      const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 88);
      window.scrollTo(0, y);
      getLenis()?.scrollTo(y, { immediate: true });
      return true;
    }
    function go(hash: string, attempt = 0) {
      // Keep retrying until Lenis itself confirms the position, so its
      // internal state can't stay desynced (retry is idempotent).
      if (land(hash) && getLenis()) return;
      if (attempt < 40) window.setTimeout(() => go(hash, attempt + 1), 50);
    }
    function onHashChange() {
      const h = window.location.hash;
      if (h && h.length > 1) go(`#${h.slice(1)}`);
    }
    const initial = window.location.hash;
    if (initial && initial.length > 1) go(`#${initial.slice(1)}`);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("wheel", resync, capture);
      window.removeEventListener("touchstart", resync, capture);
    };
  }, []);
  return null;
}
