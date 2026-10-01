"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { MEDIA_FOLDERS } from "@/lib/media";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

const MAX_BYTES = 5 * 1024 * 1024;

export type MediaState = { ok: boolean; error?: string; url?: string };

export async function uploadMedia(_prev: MediaState, formData: FormData): Promise<MediaState> {
  const user = await requireAdmin();
  const folder = String(formData.get("folder") ?? "");
  const file = formData.get("file");
  if (!MEDIA_FOLDERS.includes(folder as (typeof MEDIA_FOLDERS)[number]))
    return { ok: false, error: "Pick a folder." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a file." };
  const ext = ALLOWED[file.type];
  if (!ext) return { ok: false, error: "Only JPG, PNG, WEBP, SVG or PDF." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Max file size is 5MB." };

  const admin = createAdminClient();
  const path = `${folder}/${randomUUID()}.${ext}`;
  const { error } = await admin.storage.from("portfolio").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { ok: false, error: "Upload failed. Is the portfolio bucket created?" };

  const { data } = admin.storage.from("portfolio").getPublicUrl(path);
  await admin.from("activity_log").insert({
    actor: user.email,
    action: "MEDIA_UPLOADED",
    entity: "media",
    entity_id: path,
  });
  revalidatePath("/admin/media");
  return { ok: true, url: data.publicUrl };
}

export async function deleteMedia(path: string): Promise<MediaState> {
  await requireAdmin();
  const { error } = await createAdminClient().storage.from("portfolio").remove([path]);
  if (error) return { ok: false, error: "Couldn't delete file." };
  revalidatePath("/admin/media");
  return { ok: true };
}
