"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  type TestimonialActionState,
} from "@/app/actions/admin-testimonials";
import { useActionToast } from "@/components/admin/use-action-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type TestimonialInitial = {
  name: string;
  role: string;
  quote: string;
  sort_order: number;
};

const EMPTY: TestimonialInitial = { name: "", role: "", quote: "", sort_order: 0 };

export function TestimonialEditor({
  id,
  initial = EMPTY,
  onSuccess,
}: {
  id?: string;
  initial?: TestimonialInitial;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const action = id ? updateTestimonial.bind(null, id) : createTestimonial;
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState<TestimonialActionState, FormData>(
    action,
    { ok: true },
  );
  useActionToast(state, submitted, pending, null);

  useEffect(() => {
    if (submitted && state.ok && !pending) {
      if (onSuccess) onSuccess();
      else {
        router.push("/admin/testimonials");
        router.refresh();
      }
    }
  }, [submitted, state, pending, router, onSuccess]);

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="font-mono text-xs font-bold">NAME</label>
          <Input name="name" required defaultValue={initial.name} placeholder="Jane Doe" className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">ROLE</label>
          <Input name="role" defaultValue={initial.role} placeholder="CTO, Acme" className="mt-1.5" />
        </div>
      </div>
      <div>
        <label className="font-mono text-xs font-bold">QUOTE</label>
        <Textarea name="quote" required rows={4} defaultValue={initial.quote} placeholder="Vidun shipped…" className="mt-1.5" />
      </div>
      <div>
        <label className="font-mono text-xs font-bold">SORT ORDER</label>
        <Input name="sort_order" type="number" defaultValue={initial.sort_order} className="mt-1.5" />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={18} className="animate-spin" /> SAVING…</> : id ? "SAVE CHANGES" : "ADD TESTIMONIAL"}
      </Button>
    </form>
  );
}
