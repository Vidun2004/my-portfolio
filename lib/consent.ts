/**
 * Consent + visitor-identity helpers. First-party only.
 * `vidun-consent`: accepted | declined (always allowed, stores the choice).
 * `vidun-vid`: random visitor UUID, set ONLY after analytics consent.
 */

export type Consent = "accepted" | "declined" | null;

function cookieOpts(maxAge: number): string {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  return `; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function getConsent(): Consent {
  const v = readCookie("vidun-consent");
  return v === "accepted" || v === "declined" ? v : null;
}

export function setConsent(value: "accepted" | "declined") {
  try {
    document.cookie = `vidun-consent=${value}${cookieOpts(31536000)}`;
    window.localStorage.setItem("vidun-consent", value);
  } catch {
    /* ignore */
  }
  if (value === "accepted") ensureVisitorId();
  else {
    // Declining removes the visitor id; past rows stay anonymous-aggregate.
    try {
      document.cookie = `vidun-vid=; Path=/; Max-Age=0; SameSite=Lax`;
    } catch {
      /* ignore */
    }
  }
}

/** Returns the visitor id, creating it only when consent is accepted. */
export function ensureVisitorId(): string | null {
  if (getConsent() !== "accepted") return null;
  let id = readCookie("vidun-vid");
  if (!id) {
    try {
      id = window.crypto.randomUUID();
      document.cookie = `vidun-vid=${id}${cookieOpts(31536000)}`;
    } catch {
      return null;
    }
  }
  return id;
}

export function getVisitorId(): string | null {
  if (getConsent() !== "accepted") return null;
  return readCookie("vidun-vid");
}
