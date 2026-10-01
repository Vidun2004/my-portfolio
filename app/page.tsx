import { About } from "@/components/portfolio/about";
import { Capabilities } from "@/components/portfolio/capabilities";
import { Contact } from "@/components/portfolio/contact";
import { Experience } from "@/components/portfolio/experience";
import { Footer } from "@/components/portfolio/footer";
import { Hero } from "@/components/portfolio/hero";
import { Navbar } from "@/components/portfolio/navbar";
import { Projects } from "@/components/portfolio/projects";
import { Skills } from "@/components/portfolio/skills";

export default function Home() {
  return (
    <div className="bg-cream text-ink relative min-h-screen overflow-x-clip">
      <Navbar />
      <main className="w-full">
        <Hero />
        <Capabilities />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
