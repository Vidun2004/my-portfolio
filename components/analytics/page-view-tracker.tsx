"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent, trackView } from "@/lib/track";

/**
 * Fires a page-view beacon on mount + every route change, and auto-tracks
 * clicks on `a[data-track]` (value: "event-name:target").
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackView(pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: globalThis.MouseEvent) {
      const anchor = (e.target as HTMLElement).closest?.("a[data-track]");
      if (!anchor) return;
      const raw = anchor.getAttribute("data-track") ?? "";
      const [event, ...rest] = raw.split(":");
      if (event) trackEvent(event, rest.join(":"));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
