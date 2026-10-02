"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type ContentState = { ok: boolean; error?: string };

const aboutSchema = z.object({
  headline: z.string().trim().max(200).default(""),
  bio: z.string().trim().max(500).default(""),
  currently_building: z.string().trim().max(300).default(""),
  currently_learning: z.string().trim().max(300).default(""),
  likes: z.string().max(500).default(""),
  location: z.string().trim().max(200).default(""),
  availability: z.boolean().default(true),
  email: z.string().trim().email().max(254),
  profile_image_url: z.string().trim().max(500).default(""),
});

function csv(v: string): string[] {
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

export async function saveAbout(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireAdmin();
  const parsed = aboutSchema.safeParse({
    headline: formData.get("headline") ?? "",
    bio: formData.get("bio") ?? "",
    currently_building: formData.get("currently_building") ?? "",
    currently_learning: formData.get("currently_learning") ?? "",
    likes: formData.get("likes") ?? "",
    location: formData.get("location") ?? "",
    availability: formData.get("availability") === "on",
    email: formData.get("email") ?? "",
    profile_image_url: formData.get("profile_image_url") ?? "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const d = parsed.data;
  const admin = createAdminClient();
  const { data: existing } = await admin.from("about").select("id").limit(1).single();
  const row = {
    headline: d.headline,
    bio: d.bio,
    currently_building: d.currently_building,
    currently_learning: d.currently_learning,
    likes: csv(d.likes),
    location: d.location,
    availability: d.availability,
    email: d.email,
    profile_image_url: d.profile_image_url === "" ? null : d.profile_image_url,
    updated_at: new Date().toISOString(),
  };
  const { error } = existing
    ? await admin.from("about").update(row).eq("id", (existing as { id: string }).id)
    : await admin.from("about").insert(row);
  if (error) return { ok: false, error: "Couldn't save. Did you run migration 0005?" };
  revalidatePath("/");
  return { ok: true };
}

const SETTING_KEYS = ["site_name", "tagline", "email", "github_url", "linkedin_url"] as const;

export async function saveSettings(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireAdmin();
  const admin = createAdminClient();
  for (const key of SETTING_KEYS) {
    const value = String(formData.get(key) ?? "");
    const { error } = await admin.from("site_settings").upsert({ key, value });
    if (error) return { ok: false, error: "Couldn't save. Did you run migration 0005?" };
  }
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { ok: true };
}
