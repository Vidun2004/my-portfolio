"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createSkill, updateSkill, type SkillActionState } from "@/app/actions/admin-skills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CATS = ["languages", "frontend", "backend", "mobile", "database", "tools"] as const;

export type SkillInitial = {
  name: string;
  category: string;
  description: string;
  level: number;
  featured: boolean;
  sort_order: number;
};

export function SkillEditor({ id, initial, onSuccess }: { id?: string; initial?: SkillInitial; onSuccess?: () => void }) {
  const router = useRouter();
  const action = id ? updateSkill.bind(null, id) : createSkill;
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState<SkillActionState, FormData>(action, { ok: true });

  useEffect(() => {
    if (submitted && state.ok && !pending) {
      if (onSuccess) onSuccess();
      else {
        router.push("/admin/skills");
        router.refresh();
      }
    }
  }, [submitted, state, pending, router, onSuccess]);

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="font-mono text-xs font-bold">NAME</label>
          <Input name="name" required defaultValue={initial?.name ?? ""} placeholder="TypeScript" className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">CATEGORY</label>
          <select name="category" defaultValue={initial?.category ?? "languages"} className="mt-1.5 flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 text-sm font-base">
            {CATS.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="font-mono text-xs font-bold">DESCRIPTION</label>
        <Textarea name="description" rows={2} defaultValue={initial?.description ?? ""} className="mt-1.5" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="font-mono text-xs font-bold">LEVEL (0–100)</label>
          <Input name="level" type="number" min={0} max={100} defaultValue={initial?.level ?? 50} className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">SORT ORDER</label>
          <Input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} className="mt-1.5" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 font-mono text-xs font-bold">
            <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} className="size-4 accent-black" />
            FEATURED
          </label>
        </div>
      </div>
      {state.error && <p className="font-mono text-xs text-red-600">{state.error}</p>}
      <Button type="submit" size="lg" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={18} className="animate-spin" /> SAVING…</> : id ? "SAVE CHANGES" : "CREATE SKILL"}
      </Button>
    </form>
  );
}
