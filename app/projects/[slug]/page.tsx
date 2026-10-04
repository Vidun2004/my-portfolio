import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { TransitionLink } from "@/components/animation/page-transition";
import { CaseStory } from "@/components/portfolio/case-story";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicProjectDetail, getPublicProjectSlugs, getSettings } from "@/lib/content";

// DB-driven content reads cookies() (Supabase SSR), which is illegal on
// statically prerendered routes at runtime — serve on demand instead.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPublicProjectDetail(slug);
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getPublicProjectDetail(slug);
  if (!p) notFound();

  const dbSlugs = await getPublicProjectSlugs();
  const settings = await getSettings();
  const order = [...new Set([...dbSlugs, slug])];
  const at = order.indexOf(slug);
  const prev = order[(at - 1 + order.length) % order.length];
  const next = order[(at + 1) % order.length];
  const titleOf = (s: string) => s.replace(/-/g, " ").toUpperCase();

  return (
    <div className="bg-cream text-ink min-h-screen lg:pl-20">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 md:px-10">
        <TransitionLink href="/#projects" title="WORK" className="inline-flex items-center gap-1 font-mono text-sm font-bold hover:underline">
          <ArrowLeft size={16} /> BACK TO WORK
        </TransitionLink>

        <p className="mt-8 font-mono text-sm text-black/50">{p.tagline}</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight uppercase md:text-7xl">{p.title}</h1>
        <div className="mt-4 flex flex-wrap gap-1.5 lg:hidden">
          {p.tech.map((t) => (
            <Badge key={t} variant="neutral" className="font-mono text-xs">{t}</Badge>
          ))}
        </div>

        {p.heroImage && (
          <div className="border-ink shadow-brutal-lg rounded-brutal-lg relative mt-8 overflow-hidden border-2">
            <Image
              src={p.heroImage}
              alt={`${p.title} hero`}
              width={1200}
              height={675}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <CaseStory project={p} />

        {/* links + screenshots */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 p-6">
            <h2 className="font-mono text-xs font-bold text-black/50">LINKS</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer"><Button className="font-mono">LIVE <ArrowUpRight size={16} /></Button></a>}
              {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer"><Button variant="neutral" className="font-mono">GITHUB <ArrowUpRight size={16} /></Button></a>}
              {!p.liveUrl && !p.githubUrl && <p className="font-mono text-xs text-black/50">Links coming soon.</p>}
            </div>
          </div>
          <div className="border-ink bg-ink text-cream rounded-brutal-md border-2 p-6">
            <h2 className="font-mono text-xs font-bold text-white/50">SCREENSHOTS</h2>
            {p.gallery.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {p.gallery.slice(0, 4).map((src, i) => (
                  <div key={`${src}-${i}`} className="relative h-28 overflow-hidden rounded-lg border-2 border-white/20">
                    <Image
                      src={src}
                      alt={`${p.title} screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-white/20 font-mono text-xs text-white/40">
                    {i}/2
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* prev / next */}
        {order.length > 1 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <TransitionLink href={`/projects/${prev}`} title={titleOf(prev)}>
              <span className="border-ink bg-white shadow-brutal rounded-brutal-md group flex items-center gap-3 border-2 p-5 transition-all hover:-translate-x-1 hover:shadow-brutal-lg">
                <ArrowLeft size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                <span>
                  <span className="block font-mono text-xs text-black/40">← PREV</span>
                  <span className="font-bold">{titleOf(prev)}</span>
                </span>
              </span>
            </TransitionLink>
            <TransitionLink href={`/projects/${next}`} title={titleOf(next)}>
              <span className="border-ink bg-white shadow-brutal rounded-brutal-md group flex items-center justify-end gap-3 border-2 p-5 text-right transition-all hover:translate-x-1 hover:shadow-brutal-lg">
                <span>
                  <span className="block font-mono text-xs text-black/40">NEXT →</span>
                  <span className="font-bold">{titleOf(next)}</span>
                </span>
                <ArrowRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </TransitionLink>
          </div>
        )}
      </main>
      <Footer
        siteName={settings?.site_name}
        email={settings?.email}
        github={settings?.github_url}
        linkedin={settings?.linkedin_url}
        resumeUrl={settings?.resume_url}
      />
    </div>
  );
}
