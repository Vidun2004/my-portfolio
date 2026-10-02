"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSkill } from "@/app/actions/admin-skills";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { SkillEditor, type SkillInitial } from "@/components/admin/skill-editor";

export type SkillRow = SkillInitial & { id: string };

export function SkillsManager({ skills }: { skills: SkillRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SkillRow | "new" | null>(null);
  const [deleting, setDeleting] = useState<SkillRow | null>(null);
  const [pending, start] = useTransition();

  function closeAndRefresh() {
    setEditing(null);
    router.refresh();
    toast.add({ title: "Skill saved ✓" });
  }

  function confirmDelete() {
    if (!deleting) return;
    const row = deleting;
    start(async () => {
      const res = await deleteSkill(row.id);
      if (!res.ok) window.alert(res.error);
      else toast.add({ title: "Skill deleted" });
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-black/50">MANAGE</p>
          <h1 className="text-4xl font-bold uppercase">Skills</h1>
        </div>
        <Button onClick={() => setEditing("new")} className="font-mono">
          + NEW SKILL
        </Button>
      </div>

      {!skills.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No skills yet.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">SKILL</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">LEVEL</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">{s.name}</td>
                  <td className="px-4 py-3 font-mono text-xs uppercase">{s.category}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.level}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(s)}
                        className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs font-bold hover:-translate-y-0.5"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => setDeleting(s)}
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
        title={editing === "new" ? "New skill" : "Edit skill"}
      >
        {editing === "new" && <SkillEditor onSuccess={closeAndRefresh} />}
        {typeof editing === "object" && editing !== null && (
          <SkillEditor key={editing.id} id={editing.id} initial={editing} onSuccess={closeAndRefresh} />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete skill?"
        message={deleting ? `Delete "${deleting.name}"? This can't be undone.` : ""}
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
