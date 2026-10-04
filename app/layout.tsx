import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import { SmoothScroll } from "@/components/animation/smooth-scroll";
import { CustomCursor } from "@/components/animation/custom-cursor";
import { TransitionProvider } from "@/components/animation/page-transition";
import { SplashScreen } from "@/components/animation/splash-screen";
import { CdPlayer } from "@/components/portfolio/cd-player";
import { getPublicTracks, getSettings } from "@/lib/content";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vidun — Software Engineer",
    template: "%s — Vidun",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "VIDUN.DEV",
    title: "Vidun — Software Engineer",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidun — Software Engineer",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vidun",
  url: SITE_URL,
  jobTitle: "Software Engineering Student",
  knowsAbout: [
    "TypeScript",
    "Next.js",
    "React",
    "React Native",
    "PostgreSQL",
    "Supabase",
    "Systems",
    "Game Development",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tracks, settings] = await Promise.all([getPublicTracks(), getSettings()]);
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SmoothScroll>
          <TransitionProvider>{children}</TransitionProvider>
          <SplashScreen />
        </SmoothScroll>
        <CdPlayer tracks={tracks} spotifyUrl={settings?.spotify_playlist_url} tooltipLabel="NOW PLAYING" tooltipDuration={4500} />
        <CustomCursor />
      </body>
    </html>
  );
}
