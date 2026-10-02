import { About } from "@/components/portfolio/about";
import { Capabilities } from "@/components/portfolio/capabilities";
import { Contact } from "@/components/portfolio/contact";
import { Experience } from "@/components/portfolio/experience";
import { Footer } from "@/components/portfolio/footer";
import { Hero } from "@/components/portfolio/hero";
import { Navbar } from "@/components/portfolio/navbar";
import { Projects } from "@/components/portfolio/projects";
import { ScrollDots } from "@/components/portfolio/scroll-dots";
import { Skills } from "@/components/portfolio/skills";
import {
  getAbout,
  getPublicExperience,
  getPublicProjects,
  getPublicSkills,
  getSettings,
} from "@/lib/content";

export default async function Home() {
  const [projects, skills, experience, about, settings] = await Promise.all([
    getPublicProjects(),
    getPublicSkills(),
    getPublicExperience(),
    getAbout(),
    getSettings(),
  ]);
  return (
    <div className="bg-cream text-ink relative min-h-screen overflow-x-clip lg:pl-20">
      <Navbar />
      <ScrollDots />
      <main className="w-full">
        <Hero />
        <Capabilities />
        <About profile={about} />
        <Skills items={skills} />
        <Projects items={projects} />
        <Experience steps={experience} />
        <Contact />
      </main>
      <Footer
        siteName={settings?.site_name}
        email={settings?.email}
        github={settings?.github_url}
        linkedin={settings?.linkedin_url}
      />
    </div>
  );
}
