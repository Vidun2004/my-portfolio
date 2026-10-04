"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { uploadMedia } from "@/app/actions/admin-media";
import { Button } from "@/components/ui/button";

/**
 * Bucket-backed MP3 field — upload into audio/ and store the public URL
 * in a hidden input. No hand-typed URLs.
 */
export function AudioField({
  label,
  name,
  defaultValue = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("folder", "audio");
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
      <div className="border-ink mt-1.5 rounded-lg border-2 bg-cream p-3">
        {url ? (
          <div className="flex items-center gap-3">
            <audio controls preload="none" src={url} className="h-9 w-full" />
            <Button type="button" variant="neutral" onClick={() => setUrl("")} className="shrink-0 font-mono">
              <Trash2 size={16} /> REMOVE
            </Button>
          </div>
        ) : (
          <p className="flex h-9 items-center font-mono text-xs text-black/40">NO TRACK YET</p>
        )}
      </div>
      <div className="mt-2">
        <input
          ref={fileRef}
          type="file"
          accept="audio/mpeg"
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
          {busy ? "…" : "UPLOAD MP3"}
        </Button>
      </div>
      {error && <p className="mt-1.5 font-mono text-xs text-red-600">{error}</p>}
    </div>
  );
}
