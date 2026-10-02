"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveSettings, type ContentState } from "@/app/actions/admin-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FIELDS = [
  { key: "site_name", label: "SITE NAME", kind: "input" },
  { key: "tagline", label: "TAGLINE", kind: "textarea" },
  { key: "email", label: "EMAIL", kind: "input" },
  { key: "github_url", label: "GITHUB URL", kind: "input" },
  { key: "linkedin_url", label: "LINKEDIN URL", kind: "input" },
] as const;

export function SettingsEditor({ initial }: { initial: Record<string, string> }) {
  const [saved, setSaved] = useState(false);
  const [state, formAction, pending] = useActionState<ContentState, FormData>(
    async (prev, fd) => {
      const res = await saveSettings(prev, fd);
      setSaved(res.ok);
      return res;
    },
    { ok: true },
  );

  return (
    <form action={formAction} onSubmit={() => setSaved(false)} className="space-y-5">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="font-mono text-xs font-bold">{f.label}</label>
          {f.kind === "input" ? (
            <Input name={f.key} defaultValue={initial[f.key] ?? ""} className="mt-1.5" />
          ) : (
            <Textarea name={f.key} rows={3} defaultValue={initial[f.key] ?? ""} className="mt-1.5" />
          )}
        </div>
      ))}
      {state.error && <p className="font-mono text-xs text-red-600">{state.error}</p>}
      {saved && !pending && <p className="font-mono text-xs text-green-700">Saved ✓</p>}
      <Button type="submit" size="lg" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={18} className="animate-spin" /> SAVING…</> : "SAVE SETTINGS"}
      </Button>
    </form>
  );
}
