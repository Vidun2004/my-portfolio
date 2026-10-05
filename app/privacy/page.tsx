import type { Metadata } from "next";
import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy — Vidun",
  description: "What this site stores, why, and your choices.",
  robots: { index: false, follow: true },
};

export default async function PrivacyPage() {
  const settings = await getSettings();
  return (
    <div className="bg-cream text-ink min-h-screen lg:pl-20">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 pt-32 pb-20 md:px-10">
        <p className="font-mono text-sm text-black/50">The short, honest version.</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight uppercase md:text-6xl">Privacy</h1>

        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-10 space-y-5 border-2 p-6 font-mono text-sm leading-relaxed md:p-8">
          <section>
            <h2 className="font-bold">WHAT&apos;S STORED</h2>
            <p className="mt-1 text-black/70">
              Choice cookie (<code>vidun-consent</code>): remembers your cookie decision. Set for
              everyone, no consent needed — it <em>is</em> the consent record.
            </p>
            <p className="mt-1 text-black/70">
              Visitor cookie (<code>vidun-vid</code>): random ID for counting visits. Only set if
              you accept analytics. Never shared, never sold.
            </p>
            <p className="mt-1 text-black/70">
              Admin session cookies: only when I log in to manage the site. Visitors never get these.
            </p>
          </section>
          <section>
            <h2 className="font-bold">WHAT&apos;S COUNTED</h2>
            <p className="mt-1 text-black/70">
              Pages viewed, referrer, country (from network headers, not GPS), and device type.
              IP addresses are never stored. Decline analytics and you&apos;re counted
              anonymously — or not individually at all.
            </p>
          </section>
          <section>
            <h2 className="font-bold">RETENTION</h2>
            <p className="mt-1 text-black/70">
              View data older than 90 days is deleted automatically. Contact messages are kept
              until I delete them so I can reply.
            </p>
          </section>
          <section>
            <h2 className="font-bold">YOUR RIGHTS</h2>
            <p className="mt-1 text-black/70">
              Change your mind any time via the COOKIES link in the footer. For access or deletion
              requests, email {settings?.email ?? "me"} and I&apos;ll sort it out.
            </p>
          </section>
        </div>
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
