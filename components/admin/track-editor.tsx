"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createTrack, updateTrack, type TrackActionState } from "@/app/actions/admin-tracks";
import { AudioField } from "@/components/admin/audio-field";
import { useActionToast } from "@/components/admin/use-action-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type TrackInitial = {
  title: string;
  artist: string;
  audio_url: string;
  sort_order: number;
};

const EMPTY: TrackInitial = { title: "", artist: "", audio_url: "", sort_order: 0 };

export function TrackEditor({
  id,
  initial = EMPTY,
  onSuccess,
}: {
  id?: string;
  initial?: TrackInitial;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const action = id ? updateTrack.bind(null, id) : createTrack;
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState<TrackActionState, FormData>(
    action,
    { ok: true },
  );
  useActionToast(state, submitted, pending, null);

  useEffect(() => {
    if (submitted && state.ok && !pending) {
      if (onSuccess) onSuccess();
      else {
        router.push("/admin/tracks");
        router.refresh();
      }
    }
  }, [submitted, state, pending, router, onSuccess]);

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="font-mono text-xs font-bold">TITLE</label>
          <Input name="title" required defaultValue={initial.title} placeholder="Midnight Build" className="mt-1.5" />
        </div>
        <div>
          <label className="font-mono text-xs font-bold">ARTIST</label>
          <Input name="artist" defaultValue={initial.artist} placeholder="Who made it" className="mt-1.5" />
        </div>
      </div>
      <AudioField label="TRACK (MP3 → audio bucket)" name="audio_url" defaultValue={initial.audio_url} />
      <div>
        <label className="font-mono text-xs font-bold">SORT ORDER</label>
        <Input name="sort_order" type="number" defaultValue={initial.sort_order} className="mt-1.5" />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={18} className="animate-spin" /> SAVING…</> : id ? "SAVE CHANGES" : "ADD TRACK"}
      </Button>
    </form>
  );
}
