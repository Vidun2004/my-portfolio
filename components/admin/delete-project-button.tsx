"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/actions/admin-projects";

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onClick() {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    start(async () => {
      const res = await deleteProject(id);
      if (!res.ok) window.alert(res.error);
      router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="flex items-center gap-1 rounded-lg border-2 border-ink bg-white px-2.5 py-1 font-mono text-xs font-bold hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={14} /> {pending ? "…" : "DEL"}
    </button>
  );
}
