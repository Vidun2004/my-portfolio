"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createProject,
  updateProject,
  type ProjectActionState,
} from "@/app/actions/admin-projects";
import { GalleryField } from "@/components/admin/gallery-field";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type EditorTech = { id: string; name: string; category: string };
export type EditorInitial = {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: string;
  challenges: string;
  lessons: string;
  features_raw: string;
  hero_image_url: string;
  gallery_urls_raw: string;
  github_url: string;
  live_url: string;
  featured: boolean;
  status: string;
  sort_order: number;
  technology_ids: string[];
};

const EMPTY: EditorInitial = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  overview: "",
  problem: "",
  solution: "",
  architecture: "",
  challenges: "",
  lessons: "",
  features_raw: "",
  hero_image_url: "",
  gallery_urls_raw: "",
  github_url: "",
  live_url: "",
  featured: false,
  status: "draft",
  sort_order: 0,
  technology_ids: [],
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-xs font-bold">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function ProjectEditor({
  id,
  initial = EMPTY,
  technologies,
  onSuccess,
}: {
  id?: string;
  initial?: EditorInitial;
  technologies: EditorTech[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const action = id ? updateProject.bind(null, id) : createProject;
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState<ProjectActionState, FormData>(
    action,
    { ok: true },
  );

  useEffect(() => {
    if (submitted && state.ok && !pending) {
      if (onSuccess) onSuccess();
      else {
        router.push("/admin/projects");
        router.refresh();
      }
    }
  }, [submitted, state, pending, router, onSuccess]);

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="TITLE">
          <Input name="title" required defaultValue={initial.title} placeholder="AuditFlow" />
        </Field>
        <Field label="SLUG">
          <Input name="slug" required defaultValue={initial.slug} placeholder="auditflow" pattern="[a-z0-9-]+" />
        </Field>
      </div>
      <Field label="TAGLINE">
        <Input name="tagline" defaultValue={initial.tagline} placeholder="One sentence description" />
      </Field>
      <Field label="CARD DESCRIPTION">
        <Textarea name="description" rows={2} defaultValue={initial.description} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="PROBLEM">
          <Textarea name="problem" rows={4} defaultValue={initial.problem} />
        </Field>
        <Field label="SOLUTION">
          <Textarea name="solution" rows={4} defaultValue={initial.solution} />
        </Field>
      </div>
      <Field label="OVERVIEW">
        <Textarea name="overview" rows={3} defaultValue={initial.overview} />
      </Field>
      <Field label="FEATURES (one per line)">
        <Textarea name="features_raw" rows={4} defaultValue={initial.features_raw} placeholder={"Fast checklists\nEvidence uploads"} />
      </Field>
      <Field label="ARCHITECTURE">
        <Textarea name="architecture" rows={3} defaultValue={initial.architecture} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="CHALLENGES">
          <Textarea name="challenges" rows={3} defaultValue={initial.challenges} />
        </Field>
        <Field label="LESSONS LEARNED">
          <Textarea name="lessons" rows={3} defaultValue={initial.lessons} />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <ImageField label="HERO IMAGE" name="hero_image_url" defaultValue={initial.hero_image_url} folder="projects" />
        <Field label="GITHUB URL">
          <Input name="github_url" defaultValue={initial.github_url} placeholder="https://…" />
        </Field>
        <Field label="LIVE URL">
          <Input name="live_url" defaultValue={initial.live_url} placeholder="https://…" />
        </Field>
      </div>
      <GalleryField defaultValue={initial.gallery_urls_raw} />
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="STATUS">
          <select name="status" defaultValue={initial.status} className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 text-sm font-base">
            <option value="draft">DRAFT</option>
            <option value="published">PUBLISHED</option>
            <option value="archived">ARCHIVED</option>
          </select>
        </Field>
        <Field label="SORT ORDER">
          <Input name="sort_order" type="number" defaultValue={initial.sort_order} />
        </Field>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 font-mono text-xs font-bold">
            <input type="checkbox" name="featured" defaultChecked={initial.featured} className="size-4 accent-black" />
            FEATURED
          </label>
        </div>
      </div>
      <div>
        <p className="font-mono text-xs font-bold">TECHNOLOGIES</p>
        {technologies.length === 0 ? (
          <p className="mt-1.5 font-mono text-xs text-black/50">No technologies yet — add them in Skills first.</p>
        ) : (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {technologies.map((t) => (
              <label key={t.id} className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1 font-mono text-xs font-bold">
                <input
                  type="checkbox"
                  name="technology_ids"
                  value={t.id}
                  defaultChecked={initial.technology_ids.includes(t.id)}
                  className="size-3.5 accent-black"
                />
                {t.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {state.error && <p className="font-mono text-xs text-red-600">{state.error}</p>}
      <Button type="submit" size="lg" disabled={pending} className="font-mono">
        {pending ? <><Loader2 size={18} className="animate-spin" /> SAVING…</> : id ? "SAVE CHANGES" : "CREATE PROJECT"}
      </Button>
    </form>
  );
}
