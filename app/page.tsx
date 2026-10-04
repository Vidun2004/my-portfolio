import { About } from "@/components/portfolio/about";
import { Capabilities } from "@/components/portfolio/capabilities";
import { Contact } from "@/components/portfolio/contact";
import { Experience } from "@/components/portfolio/experience";
import { Footer } from "@/components/portfolio/footer";
import { HashRestorer } from "@/components/portfolio/hash-restorer";
import { Hero } from "@/components/portfolio/hero";
import { GithubGraph } from "@/components/portfolio/github-graph";
import { Navbar } from "@/components/portfolio/navbar";
import { Projects } from "@/components/portfolio/projects";
import { ScrollDots } from "@/components/portfolio/scroll-dots";
import { Skills } from "@/components/portfolio/skills";
import { Testimonials } from "@/components/portfolio/testimonials";
import {
  getAbout,
  getPublicExperience,
  getPublicProjects,
  getPublicSkills,
  getPublicTestimonials,
  getSettings,
} from "@/lib/content";
import { getContributions } from "@/lib/github";

export default async function Home() {
  const [projects, skills, experience, about, settings, testimonials, contributions] = await Promise.all([
    getPublicProjects(),
    getPublicSkills(),
    getPublicExperience(),
    getAbout(),
    getSettings(),
    getPublicTestimonials(),
    getContributions(),
  ]);
  return (
    <div className="bg-cream text-ink relative min-h-screen overflow-x-clip lg:pl-20">
      <Navbar />
      <ScrollDots />
      <HashRestorer />
      <main className="w-full">
        <Hero available={about?.availability} />
        <Capabilities />
        <About profile={about} />
        <Skills items={skills} />
        <Projects items={projects} />
        <Experience steps={experience} />
        <GithubGraph data={contributions} />
        <Testimonials items={testimonials} />
        <Contact />
      </main>
      <Footer
        siteName={settings?.site_name}
        email={settings?.email}
        github={settings?.github_url}
        linkedin={settings?.linkedin_url}
        resumeUrl={settings?.resume_url}
        available={about?.availability}
      />
    </div>
  );
}
