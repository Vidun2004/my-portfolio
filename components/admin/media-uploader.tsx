"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadMedia, type MediaState } from "@/app/actions/admin-media";
import { useActionToast } from "@/components/admin/use-action-toast";
import { MEDIA_FOLDERS } from "@/lib/media";
import { Button } from "@/components/ui/button";

export function MediaUploader({ onDone }: { onDone?: () => void }) {
  const [state, formAction, pending] = useActionState<MediaState, FormData>(uploadMedia, { ok: true });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useActionToast(state, submitted, pending, state.url ? `Uploaded ✓ ${state.url.split("/").pop()}` : "Uploaded ✓");

  useEffect(() => {
    if (submitted && state.ok && !pending) {
      formRef.current?.reset();
      setSubmitted(false);
      onDone?.();
    }
  }, [submitted, state, pending, onDone]);

  return (
    <form ref={formRef} action={formAction} onSubmit={() => setSubmitted(true)} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="font-mono text-xs font-bold">FOLDER</label>
        <select name="folder" defaultValue="projects" className="mt-1.5 flex h-10 rounded-base border-2 border-border bg-secondary-background px-3 text-sm font-base">
          {MEDIA_FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label className="font-mono text-xs font-bold">FILE (JPG/PNG/WEBP/SVG/PDF/MP3, ≤12MB)</label>
        <input name="file" type="file" required accept=".jpg,.jpeg,.png,.webp,.svg,.pdf" className="mt-1.5 block font-mono text-xs" />
      </div>
      <Button type="submit" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={16} className="animate-spin" /> UPLOADING…</> : <><Upload size={16} /> UPLOAD</>}
      </Button>
    </form>
  );
}
