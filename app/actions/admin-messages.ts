"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function markMessageRead(id: string) {
  await requireAdmin();
  await createAdminClient().from("contact_messages").update({ status: "read" }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await createAdminClient().from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}
