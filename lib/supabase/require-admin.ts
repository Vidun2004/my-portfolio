import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function allowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Returns the admin user or redirects to /admin/login. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !allowlist().includes(user.email.toLowerCase())) {
    redirect("/admin/login");
  }
  return user;
}

/** True when the current session belongs to an allowlisted admin. */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user?.email && allowlist().includes(user.email.toLowerCase());
}
