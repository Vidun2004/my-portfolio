"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/app/actions/admin-projects";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { ProjectEditor, type EditorInitial, type EditorTech } from "@/components/admin/project-editor";

export type ProjectRow = EditorInitial & {
  id: string;
  updated_at: string;
};

export function ProjectsManager({
  projects,
  technologies,
}: {
  projects: ProjectRow[];
  technologies: EditorTech[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ProjectRow | "new" | null>(null);
  const [deleting, setDeleting] = useState<ProjectRow | null>(null);
  const [pending, start] = useTransition();

  function closeAndRefresh(saved = true) {
    setEditing(null);
    router.refresh();
    if (saved) toast.add({ title: "Project saved ✓" });
  }

  function confirmDelete() {
    if (!deleting) return;
    const row = deleting;
    start(async () => {
      const res = await deleteProject(row.id);
      if (!res.ok) window.alert(res.error);
      else toast.add({ title: "Project deleted" });
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-black/50">MANAGE</p>
          <h1 className="text-4xl font-bold uppercase">Projects</h1>
        </div>
        <Button onClick={() => setEditing("new")} className="font-mono">
          + NEW PROJECT
        </Button>
      </div>

      {!projects.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No projects yet.</p>
          <p className="mt-2 font-mono text-sm text-black/50">The next one might be interesting.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">PROJECT</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">UPDATED</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border-2 border-ink bg-cream px-2 py-0.5 font-mono text-[11px] font-bold uppercase">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-black/50">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(p)}
                        className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs font-bold hover:-translate-y-0.5"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => setDeleting(p)}
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
        title={editing === "new" ? "New project" : "Edit project"}
        subtitle={typeof editing === "object" && editing !== null ? editing.slug : undefined}
        size="xl"
      >
        {editing === "new" && (
          <ProjectEditor technologies={technologies} onSuccess={closeAndRefresh} />
        )}
        {typeof editing === "object" && editing !== null && (
          <ProjectEditor
            key={editing.id}
            id={editing.id}
            initial={editing}
            technologies={technologies}
            onSuccess={closeAndRefresh}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete project?"
        message={deleting ? `Delete "${deleting.title}"? This can't be undone.` : ""}
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
