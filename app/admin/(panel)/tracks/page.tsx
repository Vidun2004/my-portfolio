import { createAdminClient } from "@/lib/supabase/admin";
import { TracksManager } from "@/components/admin/tracks-manager";

export default async function AdminTracksPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("tracks")
    .select("id, title, artist, audio_url, sort_order")
    .order("sort_order")
    .order("created_at");

  return (
    <TracksManager
      tracks={((data ?? []) as Record<string, unknown>[]).map((t) => ({
        id: String(t.id),
        title: (t.title as string) ?? "",
        artist: (t.artist as string) ?? "",
        audio_url: (t.audio_url as string) ?? "",
        sort_order: (t.sort_order as number) ?? 0,
      }))}
    />
  );
}
