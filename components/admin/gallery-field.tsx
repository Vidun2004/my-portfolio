"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { uploadMedia } from "@/app/actions/admin-media";
import { MediaPicker } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";

/**
 * Bucket-backed gallery field — screenshots picked from the media
 * library or uploaded straight into the bucket. Serialized one URL
 * per line into a hidden input for the project form.
 */
export function GalleryField({ defaultValue = "" }: { defaultValue?: string }) {
  const [urls, setUrls] = useState<string[]>(() =>
    defaultValue
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\/.+/.test(u)),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function add(url: string) {
    setUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }

  async function onFile(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("folder", "screenshots");
    fd.set("file", file);
    try {
      const res = await uploadMedia({ ok: false }, fd);
      if (res.ok && res.url) add(res.url);
      else setError(res.error ?? "Upload failed.");
    } catch {
      setError("Upload failed.");
    }
    setBusy(false);
  }

  return (
    <div>
      <span className="font-mono text-xs font-bold">GALLERY → CASE-STUDY SCREENSHOTS</span>
      <input type="hidden" name="gallery_urls_raw" value={urls.join("\n")} />
      {urls.length > 0 ? (
        <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {urls.map((u) => (
            <div key={u} className="border-ink group relative overflow-hidden rounded-lg border-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="Gallery screenshot" className="h-20 w-full object-cover" loading="lazy" />
              <button
                type="button"
                onClick={() => setUrls((prev) => prev.filter((x) => x !== u))}
                aria-label="Remove screenshot"
                className="border-ink bg-brand-pink absolute top-1 right-1 rounded-full border-2 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="border-ink mt-1.5 flex h-20 items-center justify-center rounded-lg border-2 border-dashed bg-cream font-mono text-xs text-black/40">
          NO SCREENSHOTS YET
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        <MediaPicker multiple onPick={add} label="ADD FROM LIBRARY" />
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
      </div>
      {error && <p className="mt-1.5 font-mono text-xs text-red-600">{error}</p>}
    </div>
  );
}
