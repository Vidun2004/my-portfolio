"use client";

import { Loader2 } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "DELETE",
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-black/70">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="neutral" onClick={onCancel} className="font-mono">
          CANCEL
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className="border-ink border-2 bg-danger font-mono text-ink"
        >
          {pending ? <><Loader2 size={16} className="animate-spin" /> …</> : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
