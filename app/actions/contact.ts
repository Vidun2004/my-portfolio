"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const INTENTS = ["build", "hi", "hire", "bug"] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  intent: z.enum(INTENTS).default("build"),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot — bots fill it
});

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function submitContact(input: {
  name: string;
  email: string;
  intent?: string;
  message: string;
  website?: string;
}): Promise<ContactResult> {
  try {
    const parsed = schema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Please check your inputs." };
    if (parsed.data.website) return { ok: true }; // spam trap: pretend success

    const { name, email, intent, message } = parsed.data;
    const supabase = await createClient();

    // rate limit: max 3 messages per email per hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", hourAgo);
    if ((count ?? 0) >= 3)
      return { ok: false, error: "Too many messages — please try again later." };

    const row = { name, email, message, intent };
    let { error } = await supabase.from("contact_messages").insert(row);
    if (error && error.code === "42703") {
      // intent column not migrated yet — store without it
      ({ error } = await supabase.from("contact_messages").insert({ name, email, message }));
    }
    if (error) return { ok: false, error: "Couldn't send. Please try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't send. Please try again." };
  }
}
