import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const BOTS = /bot|crawl|spider|slurp|mediapartners|baidu|yandex|sogou|exabot|facebot|ia_archiver|semrush|ahrefs|mj12bot|dotbot|petal/i;

// In-memory per-IP throttle (per server instance; good enough at this scale).
const hits = new Map<string, { n: number; reset: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { n: 1, reset: now + 60_000 });
    return false;
  }
  rec.n += 1;
  return rec.n > 60;
}

function deviceOf(ua: string): string {
  return /mobile|android|iphone|ipad|tablet/i.test(ua) ? "mobile" : "desktop";
}

export async function POST(req: Request) {
  try {
    const h = await headers();
    const ua = h.get("user-agent") ?? "";
    if (BOTS.test(ua)) return Response.json({ ok: true });
    const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    if (throttled(ip)) return Response.json({ ok: true }, { status: 429 });

    const body = (await req.json()) as Record<string, unknown>;
    const admin = createAdminClient();
    const consent = req.headers.get("cookie") ?? "";
    const accepted = /(?:^|; )vidun-consent=accepted(?:;|$)/.test(consent);
    const vid = accepted
      ? consent.match(/(?:^|; )vidun-vid=([^;]*)/)?.[1]?.slice(0, 64) ?? null
      : null;

    if (body.type === "event") {
      // Events are consented-only; views may be anonymous.
      if (!accepted || typeof body.event !== "string") return Response.json({ ok: true });
      await admin.from("events").insert({
        type: body.event.slice(0, 40),
        target: typeof body.target === "string" ? body.target.slice(0, 500) : "",
        visitor_id: vid,
      });
    } else {
      const path = typeof body.path === "string" ? body.path.slice(0, 300) : "/";
      if (!path.startsWith("/")) return Response.json({ ok: true });
      await admin.from("page_views").insert({
        path,
        referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "",
        country: h.get("x-vercel-ip-country") ?? "unknown",
        device: deviceOf(ua),
        visitor_id: vid,
      });
    }

    // Probabilistic retention sweep: ~2% of hits purge old rows.
    if (Math.random() < 0.02) {
      const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      await admin.from("page_views").delete().lt("created_at", cutoff);
      await admin.from("events").delete().lt("created_at", cutoff);
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
  }
}
