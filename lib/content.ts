import { createClient } from "@/lib/supabase/server";
import { PROJECTS, getProject, type ProjectCard, type ProjectDetail } from "@/lib/projects";

const COLORS = ["bg-brand-blue", "bg-brand-teal", "bg-brand-yellow", "bg-brand-pink"] as const;

export function colorFor(key: string): string {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COLORS[h % COLORS.length];
}

export function visualFor(slug: string): string {
  return `{ ${slug} }`;
}

export type SkillItem = {
  name: string;
  cat: "languages" | "frontend" | "backend" | "mobile" | "database" | "tools";
  desc: string;
  level: number;
  color: string;
};

const SKILL_COLORS: Record<SkillItem["cat"], string> = {
  languages: "bg-brand-blue",
  frontend: "bg-brand-yellow",
  backend: "bg-brand-teal",
  mobile: "bg-brand-yellow",
  database: "bg-brand-pink",
  tools: "bg-white",
};

export type JourneyStep = {
  year: string;
  role: string;
  desc: string;
  tech: string[];
  color: string;
};

export type AboutProfile = {
  headline: string;
  bio: string;
  interests: string[];
  currently_building: string;
  currently_learning: string;
  likes: string[];
  profile_image_url: string | null;
  location: string;
  availability: boolean;
  email: string;
};

export async function getAbout(): Promise<AboutProfile | undefined> {
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("about")
      .select("headline, bio, interests, currently_building, currently_learning, likes, profile_image_url, location, availability, email")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return undefined;
    return data as unknown as AboutProfile;
  } catch {
    return undefined;
  }
}

export async function getSettings(): Promise<Record<string, string> | undefined> {
  try {
    const sb = await createClient();
    const { data, error } = await sb.from("site_settings").select("key, value");
    if (error || !data?.length) return undefined;
    return Object.fromEntries(
      (data as { key: string; value: string }[]).map((r) => [r.key, r.value]),
    );
  } catch {
    return undefined;
  }
}

type DbProject = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: string;
  challenges: string;
  lessons: string;
  features: string[];
  hero_image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
};

function toCard(p: DbProject): ProjectCard {
  return {
    slug: p.slug,
    title: p.title.toUpperCase(),
    desc: p.description || p.tagline || "",
    tech: [],
    color: colorFor(p.slug),
    visual: visualFor(p.slug),
    featured: p.featured,
  };
}

export async function getPublicProjects(): Promise<ProjectCard[]> {
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("projects")
      .select("id, slug, title, tagline, description, featured")
      .eq("status", "published")
      .order("sort_order")
      .order("created_at");
    if (error || !data?.length) return PROJECTS;
    const ids = data.map((p) => p.id);
    const { data: links } = await sb
      .from("project_technologies")
      .select("project_id, technology_id, technologies(name)")
      .in("project_id", ids);
    const techByProject = new Map<string, string[]>();
    for (const l of (links ?? []) as unknown as {
      project_id: string;
      technologies: { name: string } | null;
    }[]) {
      if (!l.technologies?.name) continue;
      const arr = techByProject.get(l.project_id) ?? [];
      arr.push(l.technologies.name);
      techByProject.set(l.project_id, arr);
    }
    return (data as unknown as DbProject[]).map((p) => ({
      ...toCard(p),
      tech: techByProject.get(p.id) ?? [],
    }));
  } catch {
    return PROJECTS;
  }
}

export async function getPublicProjectSlugs(): Promise<string[]> {
  try {
    const sb = await createClient();
    const { data } = await sb.from("projects").select("slug").eq("status", "published");
    return (data ?? []).map((p) => p.slug as string);
  } catch {
    return [];
  }
}

export async function getPublicProjectDetail(slug: string): Promise<ProjectDetail | undefined> {
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (error || !data) return getProject(slug);
    const p = data as unknown as DbProject;
    const { data: links } = await sb
      .from("project_technologies")
      .select("technologies(name)")
      .eq("project_id", (data as unknown as { id: string }).id);
    const tech = ((links ?? []) as unknown as { technologies: { name: string } | null }[])
      .map((l) => l.technologies?.name)
      .filter((n): n is string => !!n);
    return {
      slug: p.slug,
      title: p.title.toUpperCase(),
      tagline: p.tagline,
      desc: p.description || p.tagline,
      overview: p.overview,
      problem: p.problem,
      solution: p.solution,
      features: p.features ?? [],
      architecture: p.architecture,
      challenges: p.challenges,
      lessons: p.lessons,
      tech,
      color: colorFor(p.slug),
      visual: visualFor(p.slug),
      featured: p.featured,
      ...(p.github_url ? { githubUrl: p.github_url } : {}),
      ...(p.live_url ? { liveUrl: p.live_url } : {}),
    };
  } catch {
    return getProject(slug);
  }
}

export async function getPublicSkills(): Promise<SkillItem[] | undefined> {
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("technologies")
      .select("name, category, description, level")
      .order("sort_order")
      .order("name");
    if (error || !data?.length) return undefined;
    return (data as unknown as { name: string; category: SkillItem["cat"]; description: string; level: number }[]).map(
      (s) => ({
        name: s.name,
        cat: s.category,
        desc: s.description || "",
        level: s.level ?? 50,
        color: SKILL_COLORS[s.category] ?? "bg-white",
      }),
    );
  } catch {
    return undefined;
  }
}

export async function getPublicExperience(): Promise<JourneyStep[] | undefined> {
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("experiences")
      .select("position, description, technologies, start_date, is_current")
      .order("sort_order")
      .order("start_date", { ascending: false });
    if (error || !data?.length) return undefined;
    return (data as unknown as {
      position: string;
      description: string;
      technologies: string[];
      start_date: string | null;
      is_current: boolean;
    }[]).map((e, i) => ({
      year: e.start_date ? e.start_date.slice(0, 4) : "NOW",
      role: e.position.toUpperCase(),
      desc: e.is_current ? `${e.description} (current)` : e.description,
      tech: e.technologies ?? [],
      color: COLORS[i % COLORS.length],
    }));
  } catch {
    return undefined;
  }
}
