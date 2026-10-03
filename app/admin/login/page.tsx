"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useAnimationControls } from "motion/react";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Floating } from "@/components/animation/floating";

export default function AdminLoginPage() {
  const router = useRouter();
  const shake = useAnimationControls();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "busy" | "done">("idle");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/admin");
    });
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "busy") return;
    setStatus("busy");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Invalid login. Try again.");
      setStatus("idle");
      shake.start({ x: [0, -12, 12, -8, 8, 0], transition: { duration: 0.4 } });
      return;
    }
    setStatus("done");
    router.push("/admin");
    router.refresh();
  }

  const busy = status !== "idle";

  return (
    <div className="bg-cream text-ink relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      {/* backdrop decor */}
      <div
        aria-hidden
        className="border-ink bg-brand-teal/20 absolute -top-16 -left-16 size-56 rounded-full border-2"
      />
      <div
        aria-hidden
        className="border-ink bg-brand-pink/20 absolute -right-16 -bottom-16 size-64 rounded-full border-2"
      />

      <motion.div animate={shake} className="relative w-full max-w-3xl">
        {/* floating stickers */}
        <div className="absolute -top-8 -left-3 z-10 md:-left-8">
          <Floating distance={8} duration={3.2}>
            <div className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md border-2 px-3 py-1.5 font-mono text-xs font-bold">
              {"{ secure }"}
            </div>
          </Floating>
        </div>
        <div className="absolute -right-3 -bottom-7 z-10 md:-right-6">
          <Floating distance={7} duration={2.8} delay={0.6}>
            <div className="border-ink bg-success rounded-full border-2 px-3 py-1 font-mono text-xs font-bold">
              ● restricted area
            </div>
          </Floating>
        </div>

        <div className="border-ink shadow-brutal-lg rounded-brutal-lg grid overflow-hidden border-2 bg-white md:grid-cols-2">
          {/* Left — terminal visual */}
          <div className="bg-ink text-cream relative hidden flex-col justify-between p-7 md:flex">
            <div>
              <div className="mt-6 font-mono text-sm leading-relaxed">
                <p className="text-cream/50">$ vidun.dev --admin</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  Hey boss,
                  <br />
                  prove it&apos;s you.
                </p>
                <p className="text-cream/60 mt-3">
                  Projects, skills, inbox and media live behind this door.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["PROJECTS", "INBOX", "MEDIA"].map((t) => (
                  <span
                    key={t}
                    className="border-cream/30 text-cream/80 rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/"
              className="text-cream/70 mt-8 inline-flex items-center gap-2 font-mono text-xs font-bold transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> BACK TO SITE
            </Link>
          </div>

          {/* Right — form */}
          <form onSubmit={onSubmit} className="w-full p-7 md:p-8">
            <h1 className="mt-1 text-3xl font-bold uppercase">Log in</h1>
            <p className="mt-1 font-mono text-xs text-black/50">
              Restricted area — authorized only.
            </p>

            <label
              htmlFor="admin-email"
              className="mt-6 block font-mono text-xs font-bold"
            >
              EMAIL
            </label>
            <Input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              disabled={busy}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vidun.dev"
              className="mt-1.5"
            />

            <label
              htmlFor="admin-password"
              className="mt-4 block font-mono text-xs font-bold"
            >
              PASSWORD
            </label>
            <div className="relative mt-1.5">
              <Input
                id="admin-password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                disabled={busy}
                aria-invalid={!!error}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                disabled={busy}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-black/50 transition-colors hover:text-black disabled:opacity-50"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p aria-live="polite" className="min-h-5">
              {error && (
                <span className="mt-3 block font-mono text-xs font-bold text-red-600">
                  {error}
                </span>
              )}
            </p>

            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="mt-4 w-full font-mono"
            >
              {status === "busy" ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> CHECKING…
                </>
              ) : status === "done" ? (
                <>
                  <Check size={18} /> WELCOME BACK
                </>
              ) : (
                "LOG IN →"
              )}
            </Button>

            <Link
              href="/"
              className="mt-4 flex items-center justify-center gap-2 font-mono text-xs font-bold text-black/50 transition-colors hover:text-black md:hidden"
            >
              <ArrowLeft size={14} /> BACK TO SITE
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
