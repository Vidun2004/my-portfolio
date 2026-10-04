"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/toast";

/**
 * Toasts an action result exactly once per settled submission.
 * Pass `success: null` when the caller (e.g. a manager) toasts success.
 */
export function useActionToast(
  state: { ok: boolean; error?: string },
  submitted: boolean,
  pending: boolean,
  success: string | null,
) {
  const seen = useRef(state);
  useEffect(() => {
    if (!submitted || pending || seen.current === state) return;
    seen.current = state;
    if (state.ok) {
      if (success) toast.add({ title: success, type: "success" });
    } else if (state.error) {
      toast.add({ title: state.error, type: "error" });
    }
  }, [state, submitted, pending, success]);
}
