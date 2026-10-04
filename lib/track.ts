import { getConsent } from "@/lib/consent";

type Payload =
  | { type: "view"; path: string; referrer: string }
  | { type: "event"; event: string; target: string };

function send(payload: Payload) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* analytics must never break the site */
  }
}

/** Page view beacon. Sent regardless of consent (anonymous when declined). */
export function trackView(path: string) {
  send({ type: "view", path, referrer: document.referrer });
}

/** Engagement event beacon. Only tracked with analytics consent. */
export function trackEvent(event: string, target = "") {
  if (getConsent() !== "accepted") return;
  send({ type: "event", event, target });
}
