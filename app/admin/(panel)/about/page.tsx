import { createAdminClient } from "@/lib/supabase/admin";
import { AboutEditor } from "@/components/admin/about-editor";

export default async function AdminAboutPage() {
  const { data } = await createAdminClient()
    .from("about")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div>
      <p className="font-mono text-sm text-black/50">MANAGE</p>
      <h1 className="text-4xl font-bold uppercase">About</h1>
      <p className="mt-1 font-mono text-xs text-black/50">Powers the terminal + mini cards on the homepage.</p>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6 md:p-8">
        <AboutEditor
          initial={{
            headline: (data?.headline as string) ?? "",
            bio: (data?.bio as string) ?? "",
            currently_building: (data?.currently_building as string) ?? "",
            currently_learning: (data?.currently_learning as string) ?? "",
            likes: (data?.likes as string[]) ?? [],
            location: (data?.location as string) ?? "",
            availability: (data?.availability as boolean) ?? true,
            email: (data?.email as string) ?? "",
            profile_image_url: (data?.profile_image_url as string) ?? "",
          }}
        />
      </div>
    </div>
  );
}
