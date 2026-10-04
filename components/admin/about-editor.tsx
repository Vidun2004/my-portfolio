"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveAbout, type ContentState } from "@/app/actions/admin-content";
import { useActionToast } from "@/components/admin/use-action-toast";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type AboutRow = {
  headline: string;
  bio: string;
  currently_building: string;
  currently_learning: string;
  likes: string[];
  location: string;
  availability: boolean;
  email: string;
  profile_image_url: string;
};

export function AboutEditor({ initial }: { initial: AboutRow }) {
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState<ContentState, FormData>(
    saveAbout,
    { ok: true },
  );
  useActionToast(state, submitted, pending, "About saved ✓ — homepage updated.");

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="font-mono text-xs font-bold">HEADLINE (use \n for line break)</label>
          <Input name="headline" defaultValue={initial.headline} className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">EMAIL</label>
          <Input name="email" defaultValue={initial.email} className="mt-1.5" />
        </div>
      </div>
      <div>
        <label className="font-mono text-xs font-bold">BIO (whoami output)</label>
        <Textarea name="bio" rows={2} defaultValue={initial.bio} className="mt-1.5" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="font-mono text-xs font-bold">CURRENTLY BUILDING</label>
          <Input name="currently_building" defaultValue={initial.currently_building} className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">CURRENTLY LEARNING</label>
          <Input name="currently_learning" defaultValue={initial.currently_learning} className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">LIKES (comma separated → terminal chips)</label>
          <Input name="likes" defaultValue={initial.likes.join(", ")} className="mt-1.5" />
        </div>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-2">
        <div>
          <label className="font-mono text-xs font-bold">LOCATION</label>
          <Input name="location" defaultValue={initial.location} className="mt-1.5" />
          <label className="mt-4 flex items-center gap-2 font-mono text-xs font-bold">
            <input type="checkbox" name="availability" defaultChecked={initial.availability} className="size-4 accent-black" />
            OPEN TO WORK
          </label>
        </div>
        <ImageField label="PROFILE IMAGE" name="profile_image_url" defaultValue={initial.profile_image_url} folder="profile" />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={18} className="animate-spin" /> SAVING…</> : "SAVE ABOUT"}
      </Button>
    </form>
  );
}
