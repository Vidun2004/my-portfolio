import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROJECTS, getProject } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: `${p.title} — Vidun`,
    description: p.tagline,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${p.title} — Vidun`,
      description: p.tagline,
      url: `/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} — Vidun`,
      description: p.tagline,
    },
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-6">
      <h2 className="font-mono text-xs font-bold tracking-wide text-black/50">{title}</h2>
      <div className="mt-3 text-black/80">{children}</div>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <div className="bg-cream text-ink min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 pt-32 pb-20 md:px-10">
        <Link href="/#projects" className="inline-flex items-center gap-1 font-mono text-sm font-bold hover:underline">
          <ArrowLeft size={16} /> BACK TO WORK
        </Link>

        <p className="mt-8 font-mono text-sm text-black/50">{p.tagline}</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight uppercase md:text-7xl">{p.title}</h1>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <Badge key={t} variant="neutral" className="font-mono text-xs">{t}</Badge>
          ))}
        </div>

        <div className={cn("border-ink shadow-brutal-lg rounded-brutal-lg mt-8 flex min-h-[280px] items-center justify-center border-2 p-10 md:min-h-[360px]", p.color)}>
          <span className="font-mono text-4xl font-bold md:text-6xl">{p.visual}</span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Block title="OVERVIEW"><p>{p.overview}</p></Block>
            <Block title="PROBLEM"><p>{p.problem}</p></Block>
            <Block title="SOLUTION"><p>{p.solution}</p></Block>
            <Block title="FEATURES">
              <ul className="list-disc space-y-1.5 pl-5">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </Block>
            <Block title="ARCHITECTURE"><p>{p.architecture}</p></Block>
            <Block title="CHALLENGES"><p>{p.challenges}</p></Block>
            <Block title="LESSONS LEARNED"><p>{p.lessons}</p></Block>
          </div>
          <aside className="space-y-6">
            <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-6">
              <h2 className="font-mono text-xs font-bold text-black/50">LINKS</h2>
              <div className="mt-3 flex flex-col gap-2">
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer"><Button className="w-full font-mono">LIVE <ArrowUpRight size={16} /></Button></a>}
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer"><Button variant="neutral" className="w-full font-mono">GITHUB <ArrowUpRight size={16} /></Button></a>}
                {!p.liveUrl && !p.githubUrl && <p className="font-mono text-xs text-black/50">Links coming soon.</p>}
              </div>
            </div>
            <div className="border-ink bg-ink text-cream rounded-brutal-md border-2 p-6">
              <h2 className="font-mono text-xs font-bold text-white/50">SCREENSHOTS</h2>
              <p className="mt-3 font-mono text-xs text-white/60">Gallery coming soon — real captures go here.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-white/20 font-mono text-xs text-white/40">
                    {i}/2
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
