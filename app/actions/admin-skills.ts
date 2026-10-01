"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

const skillSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.enum(["languages", "frontend", "backend", "mobile", "database", "tools"]),
  description: z.string().trim().max(500).default(""),
  level: z.coerce.number().int().min(0).max(100).default(50),
  featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

export type SkillActionState = { ok: boolean; error?: string };

function parse(formData: FormData) {
  return skillSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description") ?? "",
    level: formData.get("level") ?? 50,
    featured: formData.get("featured") === "on",
    sort_order: formData.get("sort_order") ?? 0,
  });
}

export async function createSkill(_prev: SkillActionState, formData: FormData): Promise<SkillActionState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  const admin = createAdminClient();
  const { data, error } = await admin.from("technologies").insert(parsed.data).select("id").single();
  if (error || !data) return { ok: false, error: error?.code === "23505" ? "That skill already exists." : "Couldn't create skill." };
  await admin.from("activity_log").insert({ actor: user.email, action: "SKILL_CREATED", entity: "skill", entity_id: data.id });
  revalidatePath("/admin/skills");
  return { ok: true };
}

export async function updateSkill(id: string, _prev: SkillActionState, formData: FormData): Promise<SkillActionState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  const admin = createAdminClient();
  const { error } = await admin.from("technologies").update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: "Couldn't update skill." };
  await admin.from("activity_log").insert({ actor: user.email, action: "SKILL_UPDATED", entity: "skill", entity_id: id });
  revalidatePath("/admin/skills");
  return { ok: true };
}

export async function deleteSkill(id: string): Promise<SkillActionState> {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("technologies").delete().eq("id", id);
  if (error) return { ok: false, error: "Couldn't delete skill. It may be linked to a project." };
  revalidatePath("/admin/skills");
  return { ok: true };
}
