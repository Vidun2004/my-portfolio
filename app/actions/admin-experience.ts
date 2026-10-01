"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

const dateOrEmpty = z.string().trim().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use YYYY-MM-DD");

const expSchema = z.object({
  company: z.string().trim().max(200).default(""),
  position: z.string().trim().min(1).max(200),
  start_date: dateOrEmpty.default(""),
  end_date: dateOrEmpty.default(""),
  is_current: z.boolean().default(false),
  description: z.string().trim().max(2000).default(""),
  technologies: z.string().trim().max(500).default(""),
  sort_order: z.coerce.number().int().default(0),
});

export type ExpActionState = { ok: boolean; error?: string };

function parse(formData: FormData) {
  return expSchema.safeParse({
    company: formData.get("company") ?? "",
    position: formData.get("position"),
    start_date: formData.get("start_date") ?? "",
    end_date: formData.get("end_date") ?? "",
    is_current: formData.get("is_current") === "on",
    description: formData.get("description") ?? "",
    technologies: formData.get("technologies") ?? "",
    sort_order: formData.get("sort_order") ?? 0,
  });
}

function toRow(d: z.infer<typeof expSchema>) {
  return {
    company: d.company,
    position: d.position,
    start_date: d.start_date === "" ? null : d.start_date,
    end_date: d.end_date === "" ? null : d.end_date,
    is_current: d.is_current,
    description: d.description,
    technologies: d.technologies.split(",").map((t) => t.trim()).filter(Boolean),
    sort_order: d.sort_order,
  };
}

export async function createExperience(_prev: ExpActionState, formData: FormData): Promise<ExpActionState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const { error } = await createAdminClient().from("experiences").insert(toRow(parsed.data));
  if (error) return { ok: false, error: "Couldn't create entry." };
  revalidatePath("/admin/experience");
  return { ok: true };
}

export async function updateExperience(id: string, _prev: ExpActionState, formData: FormData): Promise<ExpActionState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const { error } = await createAdminClient().from("experiences").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, error: "Couldn't update entry." };
  revalidatePath("/admin/experience");
  return { ok: true };
}

export async function deleteExperience(id: string): Promise<ExpActionState> {
  await requireAdmin();
  const { error } = await createAdminClient().from("experiences").delete().eq("id", id);
  if (error) return { ok: false, error: "Couldn't delete entry." };
  revalidatePath("/admin/experience");
  return { ok: true };
}
