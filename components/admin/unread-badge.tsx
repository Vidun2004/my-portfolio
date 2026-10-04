import { createAdminClient } from "@/lib/supabase/admin";

/** Inbox count badge — streams in separately so the sidebar never reloads. */
export async function UnreadBadge() {
  const { count } = await createAdminClient()
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (!count) return null;
  return (
    <span className="bg-brand-pink text-ink ml-auto rounded-full border-2 border-current px-1.5 text-[11px]">
      {count}
    </span>
  );
}
