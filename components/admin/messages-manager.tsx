"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMessage, markMessageRead } from "@/app/actions/admin-messages";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  intent: string;
  status: string;
  created_at: string;
};

export function MessagesManager({ messages }: { messages: MessageRow[] }) {
  const router = useRouter();
  const [viewing, setViewing] = useState<MessageRow | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  function refresh() {
    router.refresh();
  }

  function markRead() {
    if (!viewing) return;
    const id = viewing.id;
    start(async () => {
      await markMessageRead(id);
      setViewing(null);
      refresh();
      toast.add({ title: "Marked as read ✓" });
    });
  }

  function remove() {
    if (!viewing) return;
    const id = viewing.id;
    start(async () => {
      await deleteMessage(id);
      setConfirming(false);
      setViewing(null);
      refresh();
      toast.add({ title: "Message deleted" });
    });
  }

  return (
    <div>
      <p className="font-mono text-sm text-black/50">INBOX</p>
      <h1 className="text-4xl font-bold uppercase">Messages</h1>

      {!messages.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No messages yet.</p>
          <p className="mt-2 font-mono text-sm text-black/50">Send one from the contact form to test.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">WANTS TO</th>
                <th className="px-4 py-3">WHEN</th>
                <th className="px-4 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setViewing(m)}
                  className="cursor-pointer border-b border-ink/10 transition-colors last:border-0 hover:bg-cream"
                >
                  <td className="px-4 py-3 font-bold">
                    <span className={cn("mr-2 inline-block size-2.5 rounded-full border border-ink", m.status === "new" ? "bg-brand-pink" : "bg-ink/20")} />
                    {m.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs uppercase">{m.intent}</td>
                  <td className="px-4 py-3 font-mono text-xs text-black/50">{timeAgo(m.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border-2 border-ink bg-cream px-2 py-0.5 font-mono text-[11px] font-bold uppercase">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing ? `From ${viewing.name}` : "Message"}
        subtitle={viewing ? `${viewing.email} · ${viewing ? timeAgo(viewing.created_at) : ""}` : undefined}
      >
        {viewing && (
          <div className="space-y-4">
            <div>
              <p className="font-mono text-xs font-bold text-black/50">WANTS TO</p>
              <p className="font-mono text-sm uppercase">{viewing.intent}</p>
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-black/50">MESSAGE</p>
              <p className="whitespace-pre-wrap">{viewing.message}</p>
            </div>
            <div className="flex gap-2 pt-2">
              {viewing.status === "new" && (
                <Button onClick={markRead} disabled={pending} className="font-mono">
                  MARK AS READ
                </Button>
              )}
              <Button variant="neutral" disabled={pending} onClick={() => setConfirming(true)} className="font-mono">
                DELETE
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirming}
        title="Delete message?"
        message="This can't be undone."
        pending={pending}
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
