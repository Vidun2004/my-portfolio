"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { listMediaImages, type MediaImage } from "@/app/actions/admin-media";
import { Modal } from "@/components/admin/modal";
import { Button } from "@/components/ui/button";

/** Browse the media library and drop a URL into the hero image field. */
export function MediaPicker() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<MediaImage[] | null>(null);

  async function browse() {
    setOpen(true);
    setImages(null);
    setImages(await listMediaImages());
  }

  function pick(url: string) {
    const input = document.getElementById("hero_image_url") as HTMLInputElement | null;
    if (input) {
      input.value = url;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    setOpen(false);
  }

  return (
    <>
      <Button type="button" variant="neutral" onClick={browse} className="font-mono">
        <ImagePlus size={16} /> BROWSE MEDIA
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Pick an image" wide>
        {!images ? (
          <p className="flex items-center gap-2 py-8 font-mono text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading library…
          </p>
        ) : images.length === 0 ? (
          <p className="py-8 font-mono text-sm text-black/50">
            Library is empty — upload in Media first.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {images.map((img) => (
              <button
                key={img.path}
                type="button"
                onClick={() => pick(img.url)}
                className="border-ink bg-cream overflow-hidden rounded-lg border-2 transition-transform hover:-translate-y-0.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.path} className="h-24 w-full object-cover" loading="lazy" />
                <span className="block truncate px-1 py-1 font-mono text-[10px]">{img.path}</span>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
