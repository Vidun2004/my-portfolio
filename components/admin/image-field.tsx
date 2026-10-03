"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { uploadMedia } from "@/app/actions/admin-media";
import { MediaPicker } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";

/**
 * Bucket-backed image field — no URLs typed by hand. Pick from the
 * media library or upload straight into the Supabase bucket folder.
 * The stored value is the bucket's public URL (hidden input).
 */
export function ImageField({
  label,
  name,
  defaultValue = "",
  folder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  folder: "profile" | "projects" | "screenshots" | "documents";
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("folder", folder);
    fd.set("file", file);
    try {
      const res = await uploadMedia({ ok: false }, fd);
      if (res.ok && res.url) setUrl(res.url);
      else setError(res.error ?? "Upload failed.");
    } catch {
      setError("Upload failed.");
    }
    setBusy(false);
  }

  return (
    <div>
      <span className="font-mono text-xs font-bold">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="border-ink mt-1.5 overflow-hidden rounded-lg border-2 bg-cream">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`${label} preview`} className="h-32 w-full object-cover" loading="lazy" />
        ) : (
          <p className="flex h-32 items-center justify-center font-mono text-xs text-black/40">
            NO IMAGE YET
          </p>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <MediaPicker onPick={setUrl} />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void onFile(f);
          }}
        />
        <Button
          type="button"
          variant="neutral"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="font-mono"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {busy ? "…" : "UPLOAD"}
        </Button>
        {url && (
          <Button type="button" variant="neutral" onClick={() => setUrl("")} className="font-mono">
            <Trash2 size={16} /> REMOVE
          </Button>
        )}
      </div>
      {error && <p className="mt-1.5 font-mono text-xs text-red-600">{error}</p>}
    </div>
  );
}
