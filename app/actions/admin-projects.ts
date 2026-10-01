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

const projectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, dashes"),
  tagline: z.string().trim().max(300).default(""),
  description: z.string().trim().max(2000).default(""),
  overview: z.string().trim().default(""),
  problem: z.string().trim().default(""),
  solution: z.string().trim().default(""),
  architecture: z.string().trim().default(""),
  challenges: z.string().trim().default(""),
  lessons: z.string().trim().default(""),
  hero_image_url: urlOrEmpty.default(""),
  github_url: urlOrEmpty.default(""),
  live_url: urlOrEmpty.default(""),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sort_order: z.coerce.number().int().default(0),
  technology_ids: z.array(z.string().uuid()).default([]),
});

export type ProjectActionState = { ok: boolean; error?: string };

function parseForm(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    tagline: formData.get("tagline") ?? "",
    description: formData.get("description") ?? "",
    overview: formData.get("overview") ?? "",
    problem: formData.get("problem") ?? "",
    solution: formData.get("solution") ?? "",
    architecture: formData.get("architecture") ?? "",
    challenges: formData.get("challenges") ?? "",
    lessons: formData.get("lessons") ?? "",
    hero_image_url: formData.get("hero_image_url") ?? "",
    github_url: formData.get("github_url") ?? "",
    live_url: formData.get("live_url") ?? "",
    featured: formData.get("featured") === "on",
    status: formData.get("status") ?? "draft",
    sort_order: formData.get("sort_order") ?? 0,
    technology_ids: formData.getAll("technology_ids").map(String),
  });
}

function emptyToNull(v: string) {
  return v === "" ? null : v;
}

export async function createProject(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const { technology_ids, ...fields } = parsed.data;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("projects")
    .insert({
      title: fields.title,
      slug: fields.slug,
      tagline: fields.tagline,
      description: fields.description,
      overview: fields.overview,
      problem: fields.problem,
      solution: fields.solution,
      architecture: fields.architecture,
      challenges: fields.challenges,
      lessons: fields.lessons,
      hero_image_url: emptyToNull(fields.hero_image_url),
      github_url: emptyToNull(fields.github_url),
      live_url: emptyToNull(fields.live_url),
      featured: fields.featured,
      status: fields.status,
      sort_order: fields.sort_order,
    })
    .select("id, slug")
    .single();
  if (error || !data) return { ok: false, error: error?.code === "23505" ? "Slug already exists." : "Couldn't create project." };

  if (technology_ids.length) {
    await admin.from("project_technologies").insert(
      technology_ids.map((technology_id) => ({ project_id: data.id, technology_id })),
    );
  }
  await admin.from("activity_log").insert({
    actor: user.email,
    action: "PROJECT_CREATED",
    entity: "project",
    entity_id: data.id,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { ok: true };
}

export async function updateProject(
  id: string,
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const user = await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const { technology_ids, ...fields } = parsed.data;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("projects")
    .update({
      title: fields.title,
      slug: fields.slug,
      tagline: fields.tagline,
      description: fields.description,
      overview: fields.overview,
      problem: fields.problem,
      solution: fields.solution,
      architecture: fields.architecture,
      challenges: fields.challenges,
      lessons: fields.lessons,
      hero_image_url: emptyToNull(fields.hero_image_url),
      github_url: emptyToNull(fields.github_url),
      live_url: emptyToNull(fields.live_url),
      featured: fields.featured,
      status: fields.status,
      sort_order: fields.sort_order,
    })
    .eq("id", id)
    .select("id, slug")
    .single();
  if (error || !data) return { ok: false, error: "Couldn't update project." };

  await admin.from("project_technologies").delete().eq("project_id", id);
  if (technology_ids.length) {
    await admin.from("project_technologies").insert(
      technology_ids.map((technology_id) => ({ project_id: id, technology_id })),
    );
  }
  await admin.from("activity_log").insert({
    actor: user.email,
    action: fields.status === "published" ? "PROJECT_PUBLISHED" : "PROJECT_UPDATED",
    entity: "project",
    entity_id: id,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath(`/projects/${data.slug}`);
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ProjectActionState> {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: "Couldn't delete project." };
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { ok: true };
}
