"use client";

import { useState } from "react";
import { Check, ImagePlus, Loader2 } from "lucide-react";
import { listMediaImages, type MediaImage } from "@/app/actions/admin-media";
import { Modal } from "@/components/admin/modal";
import { Button } from "@/components/ui/button";

/** Browse the bucket library. Single pick closes; multi-pick stays open. */
export function MediaPicker({
  onPick,
  multiple = false,
  label = "BROWSE MEDIA",
}: {
  onPick?: (url: string) => void;
  multiple?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<MediaImage[] | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  async function browse() {
    setOpen(true);
    setPicked([]);
    setImages(null);
    setImages(await listMediaImages());
  }

  function pick(url: string) {
    if (onPick) {
      onPick(url);
    } else {
      const input = document.getElementById("hero_image_url") as HTMLInputElement | null;
      if (input) {
        input.value = url;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    if (multiple) setPicked((prev) => (prev.includes(url) ? prev : [...prev, url]));
    else setOpen(false);
  }

  return (
    <>
      <Button type="button" variant="neutral" onClick={browse} className="font-mono">
        <ImagePlus size={16} /> {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Pick from library" wide>
        {!images ? (
          <p className="flex items-center gap-2 py-8 font-mono text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading library…
          </p>
        ) : images.length === 0 ? (
          <p className="py-8 font-mono text-sm text-black/50">
            Library is empty — upload first.
          </p>
        ) : (
          <>
            {multiple && (
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-xs text-black/50">
                  {picked.length} picked — tap more or hit DONE
                </p>
                <Button type="button" onClick={() => setOpen(false)} className="font-mono">
                  DONE
                </Button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              {images.map((img) => (
                <button
                  key={img.path}
                  type="button"
                  onClick={() => pick(img.url)}
                  className="border-ink bg-cream relative overflow-hidden rounded-lg border-2 transition-transform hover:-translate-y-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.path} className="h-24 w-full object-cover" loading="lazy" />
                  <span className="block truncate px-1 py-1 font-mono text-[10px]">{img.path}</span>
                  {multiple && picked.includes(img.url) && (
                    <span className="border-ink bg-success absolute top-1 right-1 rounded-full border-2 p-0.5">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
