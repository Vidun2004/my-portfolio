"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "chips"; items: string[] };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "vidun — software engineering student. human. ships software." },
  { kind: "cmd", text: "cat currently.txt" },
  { kind: "out", text: "BUILDING  → production applications" },
  { kind: "out", text: "LEARNING  → AI · systems · game dev" },
  { kind: "cmd", text: "cat likes.txt" },
  { kind: "chips", items: ["clean architecture", "good ux", "automation"] },
  { kind: "cmd", text: "status" },
  { kind: "out", text: "● open to work — hello@vidun.dev" },
];

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

function runCommand(raw: string): { out: Line[]; clear?: boolean } {
  const [name, ...args] = raw.trim().split(/\s+/);
  switch (name) {
    case "help":
      return {
        out: [
          { kind: "out", text: "whoami · status · ls · cat <file> · open <section> · email · clear" },
        ],
      };
    case "whoami":
      return { out: [{ kind: "out", text: "vidun — software engineering student. human. ships software." }] };
    case "status":
      return { out: [{ kind: "out", text: "● open to work — hello@vidun.dev" }] };
    case "ls":
      return { out: [{ kind: "out", text: "currently.txt  likes.txt" }] };
    case "cat": {
      const file = (args[0] ?? "").toLowerCase();
      if (file === "currently.txt")
        return {
          out: [
            { kind: "out", text: "BUILDING  → production applications" },
            { kind: "out", text: "LEARNING  → AI · systems · game dev" },
          ],
        };
      if (file === "likes.txt")
        return { out: [{ kind: "chips", items: ["clean architecture", "good ux", "automation"] }] };
      return { out: [{ kind: "out", text: `cat: ${args[0] ?? ""}: no such file — try 'ls'` }] };
    }
    case "open": {
      const target = OPEN_TARGETS[(args[0] ?? "").toLowerCase()];
      if (!target) return { out: [{ kind: "out", text: "open where? try: work · stack · about · journey · contact" }] };
      scrollToHash(target);
      return { out: [{ kind: "out", text: `opening ${target} …` }] };
    }
    case "email":
      return { out: [{ kind: "out", text: "hello@vidun.dev — say hi, I reply fast." }] };
    case "clear":
      return { out: [], clear: true };
    case "sudo":
      return { out: [{ kind: "out", text: "nice try. this terminal has no sudo." }] };
    default:
      return { out: [{ kind: "out", text: `command not found: ${name} — try 'help'` }] };
  }
}

function useTypedLines(active: boolean, instant: boolean) {
  const [done, setDone] = useState(0);
  const [chars, setChars] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!active) return;
    if (instant) {
      setDone(SCRIPT.length);
      return;
    }
    let line = 0;
    let char = 0;
    function step() {
      const current = SCRIPT[line];
      if (!current) {
        setDone(SCRIPT.length);
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
  }, [active, instant]);

  return { done, chars };
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

const MINI = [
  { label: "CURRENTLY BUILDING", body: "Production applications", color: "bg-brand-blue", tilt: "rotate-1" },
  { label: "EXPLORING", body: "AI • Systems • Game Dev", color: "bg-brand-teal", tilt: "-rotate-1" },
  { label: "I LIKE", body: "Clean architecture • Good UX • Automation", color: "bg-brand-yellow", tilt: "rotate-2" },
];

export function About() {
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inView = useInView(termRef, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const { done, chars } = useTypedLines(inView, !!reduce);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [cleared, setCleared] = useState(false);

  const introDone = done >= SCRIPT.length;
  const visible = cleared ? [] : SCRIPT.slice(0, done);
  const typing = !reduce && !cleared && done < SCRIPT.length ? SCRIPT[done] : null;

  function submit() {
    const cmd = value.trim();
    if (!cmd) return;
    const res = runCommand(cmd);
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
            Who&apos;s behind
            <br />
            the code?
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
            <div className="text-cream min-h-72 p-5 font-mono text-sm leading-relaxed md:min-h-64 md:text-base">
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
          {MINI.map((m, i) => (
            <Reveal key={m.label} delay={0.15 + i * 0.08}>
              <div className={cn("border-ink shadow-brutal rounded-brutal-md border-2 p-4 transition-all duration-300 hover:rotate-0 hover:shadow-brutal-lg", m.color, m.tilt)}>
                <p className="font-mono text-[11px] font-bold tracking-wide">{m.label}</p>
                <p className="mt-2 text-sm font-bold">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
