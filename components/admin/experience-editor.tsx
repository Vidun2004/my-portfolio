"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createExperience, updateExperience, type ExpActionState } from "@/app/actions/admin-experience";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ExpInitial = {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  technologies: string;
  sort_order: number;
};

export function ExperienceEditor({ id, initial }: { id?: string; initial?: ExpInitial }) {
  const router = useRouter();
  const action = id ? updateExperience.bind(null, id) : createExperience;
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState<ExpActionState, FormData>(action, { ok: true });

  useEffect(() => {
    if (submitted && state.ok && !pending) {
      router.push("/admin/experience");
      router.refresh();
    }
  }, [submitted, state, pending, router]);

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="font-mono text-xs font-bold">POSITION</label>
          <Input name="position" required defaultValue={initial?.position ?? ""} placeholder="IT Junior Executive" className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">COMPANY</label>
          <Input name="company" defaultValue={initial?.company ?? ""} placeholder="Company" className="mt-1.5" />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="font-mono text-xs font-bold">START</label>
          <Input name="start_date" type="date" defaultValue={initial?.start_date ?? ""} className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">END</label>
          <Input name="end_date" type="date" defaultValue={initial?.end_date ?? ""} className="mt-1.5" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 font-mono text-xs font-bold">
            <input type="checkbox" name="is_current" defaultChecked={initial?.is_current ?? false} className="size-4 accent-black" />
            CURRENT
          </label>
        </div>
      </div>
      <div>
        <label className="font-mono text-xs font-bold">DESCRIPTION</label>
        <Textarea name="description" rows={3} defaultValue={initial?.description ?? ""} className="mt-1.5" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="font-mono text-xs font-bold">TECHNOLOGIES (comma separated)</label>
          <Input name="technologies" defaultValue={initial?.technologies ?? ""} placeholder="Linux, Docker" className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">SORT ORDER</label>
          <Input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} className="mt-1.5" />
        </div>
      </div>
      {state.error && <p className="font-mono text-xs text-red-600">{state.error}</p>}
      <Button type="submit" size="lg" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={18} className="animate-spin" /> SAVING…</> : id ? "SAVE CHANGES" : "CREATE ENTRY"}
      </Button>
    </form>
  );
}
