"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submitContact } from "@/app/actions/contact";
import { Reveal } from "@/components/animation/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Tell me your name"),
  email: z.string().email("That email looks off"),
  message: z.string().min(10, "Give me a little more detail (10+ chars)"),
});

type Form = z.infer<typeof schema>;

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Form) {
    setStatus("sending");
    setServerError(null);
    const res = await submitContact({ ...data, website: "" });
    if (!res.ok) {
      setStatus("idle");
      setServerError(res.error);
      return;
    }
    setStatus("sent");
    reset();
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <section id="contact" className="w-full border-t-2 border-ink/10 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-7xl items-start gap-10 px-6 md:grid-cols-2 md:px-10">
        <Reveal>
          <p className="font-mono text-sm text-black/50">
            Have an idea, project, question, or just want to say hello?
          </p>
          <h2 className="mt-2 text-4xl leading-[0.95] font-bold tracking-tight uppercase md:text-6xl">
            Let&apos;s build
            <br />
            something.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
            <a href="mailto:hello@vidun.dev" className="border-ink bg-white shadow-brutal rounded-brutal-md border-2 px-3 py-1.5 font-bold hover:-translate-y-0.5 hover:shadow-brutal-lg transition-all">
              hello@vidun.dev
            </a>
            <span className="border-ink bg-success rounded-full border-2 px-3 py-1.5 font-bold">
              ● ONLINE
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border-ink bg-white shadow-brutal-lg rounded-brutal-lg border-2 p-6 md:p-8"
          >
            <label className="font-mono text-xs font-bold">YOUR NAME</label>
            <Input {...register("name")} placeholder="John Doe" className="mt-1.5" />
            {errors.name && <p className="mt-1 font-mono text-xs text-red-600">{errors.name.message}</p>}

            <label className="mt-5 block font-mono text-xs font-bold">EMAIL</label>
            <Input {...register("email")} placeholder="john@example.com" className="mt-1.5" />
            {errors.email && <p className="mt-1 font-mono text-xs text-red-600">{errors.email.message}</p>}

            <label className="mt-5 block font-mono text-xs font-bold">MESSAGE</label>
            <Textarea {...register("message")} placeholder="Tell me about your idea…" rows={5} className="mt-1.5" />
            {errors.message && <p className="mt-1 font-mono text-xs text-red-600">{errors.message.message}</p>}

            {serverError && <p className="mt-3 font-mono text-xs text-red-600">{serverError}</p>}

            <Button type="submit" size="lg" disabled={status !== "idle"} className="mt-6 w-full font-mono">
              {status === "idle" && <>SEND MESSAGE <ArrowRight size={18} /></>}
              {status === "sending" && <><Loader2 size={18} className="animate-spin" /> SENDING…</>}
              {status === "sent" && <><Check size={18} /> MESSAGE SENT ✓</>}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
