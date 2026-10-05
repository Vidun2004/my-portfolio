"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveSettings, type ContentState } from "@/app/actions/admin-content";
import { ImageField } from "@/components/admin/image-field";
import { useActionToast } from "@/components/admin/use-action-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FIELDS = [
  { key: "site_name", label: "SITE NAME", kind: "input" },
  { key: "tagline", label: "TAGLINE", kind: "textarea" },
  { key: "email", label: "EMAIL", kind: "input" },
  { key: "github_url", label: "GITHUB URL", kind: "input" },
  { key: "linkedin_url", label: "LINKEDIN URL", kind: "input" },
  { key: "spotify_playlist_url", label: "SPOTIFY PLAYLIST URL", kind: "input" },
] as const;

export function SettingsEditor({ initial }: { initial: Record<string, string> }) {
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState<ContentState, FormData>(
    saveSettings,
    { ok: true },
  );
  useActionToast(state, submitted, pending, "Settings saved ✓");

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={cn(f.key === "tagline" && "md:col-span-2")}>
            <label className="font-mono text-xs font-bold">{f.label}</label>
            {f.kind === "input" ? (
              <Input name={f.key} defaultValue={initial[f.key] ?? ""} className="mt-1.5" />
            ) : (
              <Textarea name={f.key} rows={3} defaultValue={initial[f.key] ?? ""} className="mt-1.5" />
            )}
          </div>
        ))}
      </div>
      <ImageField label="RESUME (PDF → footer pill)" name="resume_url" defaultValue={initial["resume_url"] ?? ""} folder="documents" accept="application/pdf" fileKind="file" />
      <label className="flex items-center gap-2 font-mono text-xs font-bold">
        <input type="checkbox" name="contact_maintenance" defaultChecked={initial["contact_maintenance"] === "true"} className="size-4 accent-black" />
        CONTACT FORM MAINTENANCE MODE (shows email fallback)
      </label>
      <Button type="submit" size="lg" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={18} className="animate-spin" /> SAVING…</> : "SAVE SETTINGS"}
      </Button>
    </form>
  );
}
