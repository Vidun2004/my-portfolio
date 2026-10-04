import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsEditor } from "@/components/admin/settings-editor";

export default async function AdminSettingsPage() {
  const { data } = await createAdminClient().from("site_settings").select("key, value");
  const initial: Record<string, string> = {};
  for (const r of (data ?? []) as { key: string; value: string }[]) initial[r.key] = r.value;

  return (
    <div>
      <p className="font-mono text-sm text-black/50">MANAGE</p>
      <h1 className="text-4xl font-bold uppercase">Settings</h1>
      <p className="mt-1 font-mono text-xs text-black/50">Site-wide name, tagline, email and socials.</p>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6 md:p-8">
        <SettingsEditor initial={initial} />
      </div>
    </div>
  );
}
