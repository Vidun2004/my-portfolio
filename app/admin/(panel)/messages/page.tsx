import { createAdminClient } from "@/lib/supabase/admin";
import { MessagesManager } from "@/components/admin/messages-manager";

export default async function AdminMessagesPage() {
  const admin = createAdminClient();
  const { data: messages } = await admin
    .from("contact_messages")
    .select("id, name, email, message, intent, status, created_at")
    .order("created_at", { ascending: false });

  const rows = ((messages ?? []) as Record<string, unknown>[]).map((m) => ({
    id: String(m.id),
    name: (m.name as string) ?? "",
    email: (m.email as string) ?? "",
    message: (m.message as string) ?? "",
    intent: (m.intent as string) ?? "—",
    status: (m.status as string) ?? "new",
    created_at: (m.created_at as string) ?? "",
  }));

  return <MessagesManager messages={rows} />;
}
