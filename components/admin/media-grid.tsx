"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { deleteMedia } from "@/app/actions/admin-media";
import type { MediaFile } from "@/app/admin/(panel)/media/page";

export function MediaGrid({ files }: { files: MediaFile[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);

  function remove(path: string) {
    if (!window.confirm(`Delete ${path}?`)) return;
    start(async () => {
      const res = await deleteMedia(path);
      if (!res.ok) window.alert(res.error);
      router.refresh();
    });
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((f) => (
        <div key={f.path} className="border-ink bg-white shadow-brutal rounded-brutal-md overflow-hidden border-2">
          <div className="bg-cream flex h-32 items-center justify-center overflow-hidden border-b-2 border-ink p-2">
            {/\.(jpg|jpeg|png|webp|svg)$/i.test(f.name) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.url} alt={f.name} className="max-h-full object-contain" loading="lazy" />
            ) : (
              <span className="font-mono text-xs font-bold">PDF FILE</span>
            )}
          </div>
          <div className="p-3">
            <p className="truncate font-mono text-xs font-bold">{f.name}</p>
            <p className="font-mono text-[11px] text-black/50">{f.folder}/</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => copy(f.url)}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border-2 border-ink bg-cream px-2 py-1 font-mono text-xs font-bold"
              >
                {copied === f.url ? <><Check size={14} /> COPIED</> : <><Copy size={14} /> URL</>}
              </button>
              <button
                onClick={() => remove(f.path)}
                disabled={pending}
                className="flex items-center gap-1 rounded-lg border-2 border-ink bg-white px-2 py-1 font-mono text-xs font-bold hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={14} /> DEL
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
