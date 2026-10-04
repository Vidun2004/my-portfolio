"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(100),
  role: z.string().trim().max(200).default(""),
  quote: z.string().trim().min(1).max(1000),
  sort_order: z.coerce.number().int().default(0),
});

export type TestimonialActionState = { ok: boolean; error?: string };

function parse(formData: FormData) {
  return testimonialSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role") ?? "",
    quote: formData.get("quote"),
    sort_order: formData.get("sort_order") ?? 0,
  });
}

function touch() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function createTestimonial(
  _prev: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  const admin = createAdminClient();
  const { data, error } = await admin.from("testimonials").insert(parsed.data).select("id").single();
  if (error || !data) return { ok: false, error: "Couldn't create testimonial." };
  await admin.from("activity_log").insert({
    actor: user.email,
    action: "TESTIMONIAL_CREATED",
    entity: "testimonial",
    entity_id: data.id,
  });
  touch();
  return { ok: true };
}

export async function updateTestimonial(
  id: string,
  _prev: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: "Couldn't update testimonial." };
  await admin.from("activity_log").insert({
    actor: user.email,
    action: "TESTIMONIAL_UPDATED",
    entity: "testimonial",
    entity_id: id,
  });
  touch();
  return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<TestimonialActionState> {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").delete().eq("id", id);
  if (error) return { ok: false, error: "Couldn't delete testimonial." };
  touch();
  return { ok: true };
}
