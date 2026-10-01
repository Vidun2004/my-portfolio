"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteExperience } from "@/app/actions/admin-experience";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ExperienceEditor, type ExpInitial } from "@/components/admin/experience-editor";

export type ExpRow = ExpInitial & { id: string };

export function ExperienceManager({ items }: { items: ExpRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ExpRow | "new" | null>(null);
  const [deleting, setDeleting] = useState<ExpRow | null>(null);
  const [pending, start] = useTransition();

  function closeAndRefresh() {
    setEditing(null);
    router.refresh();
  }

  function confirmDelete() {
    if (!deleting) return;
    const row = deleting;
    start(async () => {
      const res = await deleteExperience(row.id);
      if (!res.ok) window.alert(res.error);
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-black/50">MANAGE</p>
          <h1 className="text-4xl font-bold uppercase">Experience</h1>
        </div>
        <Button onClick={() => setEditing("new")} className="font-mono">
          + NEW ENTRY
        </Button>
      </div>

      {!items.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No entries yet.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">POSITION</th>
                <th className="px-4 py-3">COMPANY</th>
                <th className="px-4 py-3">START</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">{e.position}</td>
                  <td className="px-4 py-3">{e.company || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {e.start_date || "—"}
                    {e.is_current ? " → now" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(e)}
                        className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs font-bold hover:-translate-y-0.5"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => setDeleting(e)}
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
        title={editing === "new" ? "New entry" : "Edit entry"}
      >
        {editing === "new" && <ExperienceEditor onSuccess={closeAndRefresh} />}
        {typeof editing === "object" && editing !== null && (
          <ExperienceEditor key={editing.id} id={editing.id} initial={editing} onSuccess={closeAndRefresh} />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete entry?"
        message={deleting ? `Delete "${deleting.position}"? This can't be undone.` : ""}
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
