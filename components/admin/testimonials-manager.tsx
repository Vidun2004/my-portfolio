"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTestimonial } from "@/app/actions/admin-testimonials";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { TestimonialEditor, type TestimonialInitial } from "@/components/admin/testimonial-editor";

export type TestimonialRow = TestimonialInitial & { id: string };

export function TestimonialsManager({ testimonials }: { testimonials: TestimonialRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<TestimonialRow | "new" | null>(null);
  const [deleting, setDeleting] = useState<TestimonialRow | null>(null);
  const [pending, start] = useTransition();

  function closeAndRefresh() {
    setEditing(null);
    router.refresh();
    toast.add({ title: "Testimonial saved ✓" });
  }

  function confirmDelete() {
    if (!deleting) return;
    const row = deleting;
    start(async () => {
      const res = await deleteTestimonial(row.id);
      if (!res.ok) window.alert(res.error);
      else toast.add({ title: "Testimonial deleted" });
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-black/50">MANAGE</p>
          <h1 className="text-4xl font-bold uppercase">Testimonials</h1>
        </div>
        <Button onClick={() => setEditing("new")} className="font-mono">
          + NEW QUOTE
        </Button>
      </div>

      {!testimonials.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No quotes yet.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">QUOTE</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">
                    {t.name}
                    <span className="block font-mono text-xs font-normal text-black/50">{t.role}</span>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-black/70">{t.quote}</td>
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
        title={editing === "new" ? "New testimonial" : "Edit testimonial"}
      >
        {editing === "new" && <TestimonialEditor onSuccess={closeAndRefresh} />}
        {typeof editing === "object" && editing !== null && (
          <TestimonialEditor key={editing.id} id={editing.id} initial={editing} onSuccess={closeAndRefresh} />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete testimonial?"
        message={deleting ? `Delete the quote from "${deleting.name}"? This can't be undone.` : ""}
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
