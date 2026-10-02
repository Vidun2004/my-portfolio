import { ArrowUpRight } from "lucide-react";

export function Footer({
  siteName,
  email,
  github,
  linkedin,
}: {
  siteName?: string;
  email?: string;
  github?: string;
  linkedin?: string;
}) {
  const mail = email ?? "hello@vidun.dev";
  return (
    <footer data-dark-cursor className="border-ink bg-ink text-cream w-full border-t-2">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <p className="text-xl font-bold">{siteName ?? "VIDUN.DEV"}</p>
          <p className="mt-1 font-mono text-xs text-white/60">
            Built with curiosity, TypeScript and too much coffee.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
          {[
            { label: "GitHub", href: github ?? "https://github.com" },
            { label: "LinkedIn", href: linkedin ?? "https://linkedin.com" },
            { label: "Email", href: `mailto:${mail}` },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-full border-2 border-white/20 px-3 py-1.5 transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              {l.label} <ArrowUpRight size={14} />
            </a>
          ))}
          <span className="rounded-full border-2 border-white/20 px-3 py-1.5">
            ● STATUS: BUILDING
          </span>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 font-mono text-xs text-white/50 md:px-10">
          <span>© 2026 Vidun</span>
          <a href="#home" className="hover:text-white">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  );
}
