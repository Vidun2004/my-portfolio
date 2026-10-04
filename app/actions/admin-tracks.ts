"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

const urlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Must be a URL");

const trackSchema = z.object({
  title: z.string().trim().min(1).max(200),
  artist: z.string().trim().max(200).default(""),
  audio_url: urlOrEmpty,
  sort_order: z.coerce.number().int().default(0),
});

export type TrackActionState = { ok: boolean; error?: string };

function parse(formData: FormData) {
  return trackSchema.safeParse({
    title: formData.get("title"),
    artist: formData.get("artist") ?? "",
    audio_url: formData.get("audio_url") ?? "",
    sort_order: formData.get("sort_order") ?? 0,
  });
}

function touch() {
  revalidatePath("/admin/tracks");
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "layout");
}

export async function createTrack(
  _prev: TrackActionState,
  formData: FormData,
): Promise<TrackActionState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  if (!parsed.data.audio_url) return { ok: false, error: "Upload an MP3 first." };
  const admin = createAdminClient();
  const { data, error } = await admin.from("tracks").insert(parsed.data).select("id").single();
  if (error || !data) return { ok: false, error: "Couldn't create track." };
  await admin.from("activity_log").insert({
    actor: user.email,
    action: "TRACK_CREATED",
    entity: "track",
    entity_id: data.id,
  });
  touch();
  return { ok: true };
}

export async function updateTrack(
  id: string,
  _prev: TrackActionState,
  formData: FormData,
): Promise<TrackActionState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  if (!parsed.data.audio_url) return { ok: false, error: "Upload an MP3 first." };
  const admin = createAdminClient();
  const { error } = await admin.from("tracks").update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: "Couldn't update track." };
  await admin.from("activity_log").insert({
    actor: user.email,
    action: "TRACK_UPDATED",
    entity: "track",
    entity_id: id,
  });
  touch();
  return { ok: true };
}

export async function deleteTrack(id: string): Promise<TrackActionState> {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("tracks").delete().eq("id", id);
  if (error) return { ok: false, error: "Couldn't delete track." };
  touch();
  return { ok: true };
}
