"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTrack } from "@/app/actions/admin-tracks";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { TrackEditor, type TrackInitial } from "@/components/admin/track-editor";

export type TrackRow = TrackInitial & { id: string };

export function TracksManager({ tracks }: { tracks: TrackRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<TrackRow | "new" | null>(null);
  const [deleting, setDeleting] = useState<TrackRow | null>(null);
  const [pending, start] = useTransition();

  function closeAndRefresh() {
    setEditing(null);
    router.refresh();
    toast.add({ title: "Track saved ✓" });
  }

  function confirmDelete() {
    if (!deleting) return;
    const row = deleting;
    start(async () => {
      const res = await deleteTrack(row.id);
      if (!res.ok) window.alert(res.error);
      else toast.add({ title: "Track deleted" });
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-black/50">MANAGE</p>
          <h1 className="text-4xl font-bold uppercase">Playlist</h1>
        </div>
        <Button onClick={() => setEditing("new")} className="font-mono">
          + NEW TRACK
        </Button>
      </div>

      {!tracks.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No tracks yet.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">TRACK</th>
                <th className="px-4 py-3">PREVIEW</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">
                    {t.title}
                    <span className="block font-mono text-xs font-normal text-black/50">{t.artist}</span>
                  </td>
                  <td className="px-4 py-3">
                    <audio controls preload="none" src={t.audio_url} className="h-9 w-48" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(t)}
                        className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs font-bold hover:-translate-y-0.5"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => setDeleting(t)}
                        className="rounded-lg border-2 border-ink bg-white px-2.5 py-1 font-mono text-xs font-bold hover:bg-red-50"
                      >
                        DEL
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "New track" : "Edit track"}
      >
        {editing === "new" && <TrackEditor onSuccess={closeAndRefresh} />}
        {typeof editing === "object" && editing !== null && (
          <TrackEditor key={editing.id} id={editing.id} initial={editing} onSuccess={closeAndRefresh} />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete track?"
        message={deleting ? `Delete "${deleting.title}"? This can't be undone.` : ""}
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
