"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid login. Try again.");
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="bg-cream text-ink flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="border-ink bg-white shadow-brutal-lg rounded-brutal-lg w-full max-w-md border-2 p-8"
      >
        <p className="font-mono text-xs font-bold text-black/40">VIDUN.DEV ADMIN</p>
        <h1 className="mt-1 text-3xl font-bold uppercase">Log in</h1>
        <label className="mt-6 block font-mono text-xs font-bold">EMAIL</label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5"
        />
        <label className="mt-4 block font-mono text-xs font-bold">PASSWORD</label>
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5"
        />
        {error && <p className="mt-3 font-mono text-xs text-red-600">{error}</p>}
        <Button type="submit" size="lg" disabled={busy} className="mt-6 w-full font-mono">
          {busy ? <><Loader2 size={18} className="animate-spin" /> CHECKING…</> : "LOG IN →"}
        </Button>
      </form>
    </div>
  );
}
