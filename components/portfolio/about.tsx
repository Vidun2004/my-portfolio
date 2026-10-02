"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import { Reveal } from "@/components/animation/reveal";
import type { AboutProfile } from "@/lib/content";
import { cn } from "@/lib/utils";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "chips"; items: string[] };

const FALLBACK: AboutProfile = {
  headline: "Who's behind the code?",
  bio: "vidun — software engineering student. human. ships software.",
  interests: [],
  currently_building: "production applications",
  currently_learning: "AI · systems · game dev",
  likes: ["clean architecture", "good ux", "automation"],
  profile_image_url: null,
  location: "",
  availability: true,
  email: "hello@vidun.dev",
};

function buildScript(p: AboutProfile): Line[] {
  return [
    { kind: "cmd", text: "whoami" },
    { kind: "out", text: p.bio },
    { kind: "cmd", text: "cat currently.txt" },
    { kind: "out", text: `BUILDING  → ${p.currently_building}` },
    { kind: "out", text: `LEARNING  → ${p.currently_learning}` },
    { kind: "cmd", text: "cat likes.txt" },
    { kind: "chips", items: p.likes.length ? p.likes : ["code"] },
    { kind: "cmd", text: "status" },
    { kind: "out", text: p.availability ? `● open to work — ${p.email}` : `● busy — ${p.email}` },
  ];
}

const OPEN_TARGETS: Record<string, string> = {
  home: "#home",
  top: "#home",
  build: "#build",
  about: "#about",
  who: "#about",
  stack: "#skills",
  skills: "#skills",
  work: "#projects",
  projects: "#projects",
  journey: "#experience",
  experience: "#experience",
  contact: "#contact",
  hi: "#contact",
  hello: "#contact",
};

function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -88, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

type Entry = { cmd: string; out: Line[] };

function runCommand(raw: string, p: AboutProfile): { out: Line[]; clear?: boolean } {
  const [name, ...args] = raw.trim().split(/\s+/);
  switch (name) {
    case "help":
      return {
        out: [
          { kind: "out", text: "whoami · status · ls · cat <file> · open <section> · email · clear" },
        ],
      };
    case "whoami":
      return { out: [{ kind: "out", text: p.bio }] };
    case "status":
      return { out: [{ kind: "out", text: p.availability ? `● open to work — ${p.email}` : `● busy — ${p.email}` }] };
    case "ls":
      return { out: [{ kind: "out", text: "currently.txt  likes.txt" }] };
    case "cat": {
      const file = (args[0] ?? "").toLowerCase();
      if (file === "currently.txt")
        return {
          out: [
            { kind: "out", text: `BUILDING  → ${p.currently_building}` },
            { kind: "out", text: `LEARNING  → ${p.currently_learning}` },
          ],
        };
      if (file === "likes.txt")
        return { out: [{ kind: "chips", items: p.likes.length ? p.likes : ["code"] }] };
      return { out: [{ kind: "out", text: `cat: ${args[0] ?? ""}: no such file — try 'ls'` }] };
    }
    case "open": {
      const target = OPEN_TARGETS[(args[0] ?? "").toLowerCase()];
      if (!target) return { out: [{ kind: "out", text: "open where? try: work · stack · about · journey · contact" }] };
      scrollToHash(target);
      return { out: [{ kind: "out", text: `opening ${target} …` }] };
    }
    case "email":
      return { out: [{ kind: "out", text: `${p.email} — say hi, I reply fast.` }] };
    case "clear":
      return { out: [], clear: true };
    case "sudo":
      return { out: [{ kind: "out", text: "nice try. this terminal has no sudo." }] };
    default:
      return { out: [{ kind: "out", text: `command not found: ${name} — try 'help'` }] };
  }
}

function RenderLine({ line }: { line: Line }) {
  if (line.kind === "cmd") {
    return (
      <p>
        <span className="text-brand-teal">$ </span>
        {line.text}
      </p>
    );
  }
  if (line.kind === "chips") {
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {line.items.map((c) => (
          <span key={c} className="rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-xs">
            {c}
          </span>
        ))}
      </div>
    );
  }
  return (
    <p className="text-white/80">
      {line.text.startsWith("●") ? <span className="text-success">{line.text}</span> : line.text}
    </p>
  );
}

export function About({ profile }: { profile?: AboutProfile }) {
  const p = profile ?? FALLBACK;
  const script = useMemo(() => buildScript(p), [p]);

  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(termRef, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();

  const [done, setDone] = useState(0);
  const [chars, setChars] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDone(script.length);
      return;
    }
    let line = 0;
    let char = 0;
    function step() {
      const current = script[line];
      if (!current) {
        setDone(script.length);
        return;
      }
      if (current.kind === "cmd") {
        if (char <= current.text.length) {
          setChars(char);
          char += 1;
          timers.current.push(setTimeout(step, 42));
        } else {
          line += 1;
          char = 0;
          setDone(line);
          timers.current.push(setTimeout(step, 260));
        }
      } else {
        line += 1;
        char = 0;
        setChars(0);
        setDone(line);
        timers.current.push(setTimeout(step, 320));
      }
    }
    timers.current.push(setTimeout(step, 500));
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [inView, reduce, script]);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [cleared, setCleared] = useState(false);

  const introDone = done >= script.length;
  const visible = cleared ? [] : script.slice(0, done);
  const typing = !reduce && !cleared && done < script.length ? script[done] : null;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [done, chars, entries]);

  function submit() {
    const cmd = value.trim();
    if (!cmd) return;
    const res = runCommand(cmd, p);
    if (res.clear) {
      setCleared(true);
      setEntries([]);
    } else {
      setEntries((prev) => [...prev.slice(-49), { cmd, out: res.out }]);
    }
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <section id="about" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-sm text-black/50">
            A developer who likes understanding how things actually work.
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight uppercase md:text-6xl">
            {p.headline.split("\n").map((l, i, arr) => (
              <span key={i}>
                {l}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div ref={termRef} onClick={() => inputRef.current?.focus()} className="border-ink bg-ink shadow-brutal-lg rounded-brutal-lg mx-auto mt-10 max-w-3xl overflow-hidden border-2">
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-2.5">
              <span className="font-mono text-xs text-white/60">vidun@dev:~ — click to type</span>
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-400" />
              </span>
            </div>
            <div
              ref={scrollRef}
              data-dark-cursor
              className="text-cream h-80 overflow-y-auto p-5 font-mono text-sm leading-relaxed md:h-96 md:text-base"
            >
              {visible.map((l, i) => (
                <RenderLine key={`s-${i}`} line={l} />
              ))}
              {entries.map((e, i) => (
                <div key={`e-${i}`}>
                  <p>
                    <span className="text-brand-teal">$ </span>
                    {e.cmd}
                  </p>
                  {e.out.map((l, j) => (
                    <RenderLine key={`e-${i}-${j}`} line={l} />
                  ))}
                </div>
              ))}
              {typing && typing.kind === "cmd" && (
                <p>
                  <span className="text-brand-teal">$ </span>
                  {typing.text.slice(0, chars)}
                  <span className="ml-0.5 inline-block h-4 w-2.5 animate-pulse bg-brand-yellow align-middle" />
                </p>
              )}
              {introDone && (
                <div className="flex items-center">
                  <span className="text-brand-teal">$&nbsp;</span>
                  <span className="whitespace-pre-wrap break-all">{value}</span>
                  <span className="ml-0.5 inline-block h-4 w-2.5 shrink-0 animate-pulse bg-brand-yellow align-middle" />
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submit();
                    }}
                    aria-label="Terminal input"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-px text-base opacity-0"
                  />
                </div>
              )}
              {introDone && entries.length === 0 && !cleared && (
                <p className="mt-2 text-xs text-white/35">↑ intro done — your turn. try &apos;help&apos;</p>
              )}
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
          <div className="border-ink bg-brand-blue shadow-brutal rounded-brutal-md rotate-1 border-2 p-4 transition-all duration-300 hover:rotate-0 hover:shadow-brutal-lg">
            <p className="font-mono text-[11px] font-bold tracking-wide">CURRENTLY BUILDING</p>
            <p className="mt-2 text-sm font-bold">{p.currently_building}</p>
          </div>
          <div className="border-ink bg-brand-teal shadow-brutal rounded-brutal-md -rotate-1 border-2 p-4 transition-all duration-300 hover:rotate-0 hover:shadow-brutal-lg">
            <p className="font-mono text-[11px] font-bold tracking-wide">EXPLORING</p>
            <p className="mt-2 text-sm font-bold">{p.currently_learning}</p>
          </div>
          <div className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md rotate-2 border-2 p-4 transition-all duration-300 hover:rotate-0 hover:shadow-brutal-lg">
            <p className="font-mono text-[11px] font-bold tracking-wide">BASED IN</p>
            <p className="mt-2 text-sm font-bold">{p.location || "Earth"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
