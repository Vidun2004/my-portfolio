"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submitContact } from "@/app/actions/contact";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/animation/reveal";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(2, "name?"),
  email: z.string().trim().email("that email looks off"),
  intent: z.enum(["build", "hi", "hire", "bug"]),
  message: z.string().trim().min(10, "give me a little more (10+ chars)"),
});

type Form = z.infer<typeof schema>;

const INTENT_LABEL: Record<Form["intent"], string> = {
  build: "build something",
  hi: "say hi",
  hire: "work together",
  bug: "report a bug",
};

export function Contact({ maintenance = false, email }: { maintenance?: boolean; email?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { intent: "build" } });

  async function onSubmit(data: Form) {
    setStatus("sending");
    setServerError(null);
    try {
      const res = await submitContact({ ...data, website: "" });
      if (!res.ok) {
        setStatus("idle");
        setServerError(res.error);
        return;
      }
    } catch {
      setStatus("idle");
      setServerError("Couldn't send. Please try again.");
      return;
    }
    setStatus("sent");
    reset({ intent: "build" });
    trackEvent("contact_submit", data.intent);
    setTimeout(() => setStatus("idle"), 3000);
  }

  const err = errors.name?.message ?? errors.email?.message ?? errors.message?.message;

  return (
    <section id="contact" className="flex min-h-svh w-full flex-col justify-center border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-sm text-black/50">
              Have an idea, project, question, or just want to say hello?
            </p>
            <h2 className="mt-2 text-4xl leading-[0.95] font-bold tracking-tight uppercase md:text-6xl">
              Let&apos;s build
              <br />
              something.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {maintenance ? (
            <div className="border-ink bg-brand-yellow shadow-brutal-lg rounded-brutal-lg mx-auto mt-10 max-w-4xl border-2 p-6 text-center md:p-10">
              <p className="inline-block rounded-full border-2 border-ink bg-white px-3 py-1 font-mono text-xs font-bold">
                ⚠ UNDER MAINTENANCE
              </p>
              <p className="mt-4 text-2xl font-bold uppercase md:text-3xl">
                The form is taking a nap.
              </p>
              <p className="mx-auto mt-2 max-w-md text-black/70">
                It&apos;ll be back soon — until then, my inbox is wide open.
              </p>
              {email && (
                <a href={`mailto:${email}`} className="mt-6 inline-block">
                  <span className="border-ink bg-ink text-cream shadow-brutal rounded-brutal-md inline-block border-2 px-6 py-3 font-mono text-sm font-bold">
                    EMAIL ME → {email}
                  </span>
                </a>
              )}
            </div>
          ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border-ink bg-white shadow-brutal-lg rounded-brutal-lg mx-auto mt-10 max-w-4xl border-2 p-6 md:p-10"
          >
            <p className="text-xl leading-loose font-bold md:text-3xl md:leading-loose">
              Hi, I&apos;m{" "}
              <input
                {...register("name")}
                placeholder="your name"
                autoComplete="name"
                className="border-ink w-44 rounded-lg border-b-4 bg-cream px-2 py-0.5 text-center align-baseline placeholder:text-black/30 focus:outline-none md:w-56"
              />{" "}
              — reach me at{" "}
              <input
                {...register("email")}
                placeholder="you@mail.com"
                autoComplete="email"
                className="border-ink w-52 rounded-lg border-b-4 bg-cream px-2 py-0.5 text-center align-baseline placeholder:text-black/30 focus:outline-none md:w-72"
              />
              . I want to{" "}
              <select
                {...register("intent")}
                className="border-ink bg-brand-yellow rounded-lg border-2 px-2 py-0.5 align-baseline focus:outline-none"
              >
                {(Object.keys(INTENT_LABEL) as Form["intent"][]).map((k) => (
                  <option key={k} value={k}>{INTENT_LABEL[k]}</option>
                ))}
              </select>
              .
            </p>

            <label className="mt-8 block font-mono text-xs font-bold text-black/50">
              THE DETAILS ↓
            </label>
            <textarea
              {...register("message")}
              placeholder="Tell me everything — idea, timeline, links…"
              rows={4}
              className="border-ink mt-2 min-h-32 w-full rounded-xl border-2 bg-cream p-4 text-base font-medium placeholder:text-black/30 focus:outline-none md:text-lg"
            />

            {(err ?? serverError) && (
              <p className="mt-3 font-mono text-xs text-red-600">↑ {serverError ?? err}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] text-black/45">
                Stored only so I can reply — never shared.
              </p>
              <Button type="submit" size="lg" disabled={status !== "idle"} className="font-mono">
                {status === "idle" && <>SEND IT <ArrowRight size={18} /></>}
                {status === "sending" && <><Loader2 size={18} className="animate-spin" /> SENDING…</>}
                {status === "sent" && <><Check size={18} /> SENT ✓</>}
              </Button>
            </div>
          </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
