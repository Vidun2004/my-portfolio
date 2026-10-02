import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteMessage, markMessageRead } from "@/app/actions/admin-messages";
import { Button } from "@/components/ui/button";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: m } = await admin.from("contact_messages").select("*").eq("id", id).single();
  if (!m) notFound();

  async function markRead() {
    "use server";
    await markMessageRead(id);
  }
  async function remove() {
    "use server";
    await deleteMessage(id);
    redirect("/admin/messages");
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/messages" className="font-mono text-sm font-bold hover:underline">← BACK TO MESSAGES</Link>
      <h1 className="mt-2 text-4xl font-bold uppercase">Message</h1>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 space-y-4 border-2 p-6">
        <div>
          <p className="font-mono text-xs font-bold text-black/50">FROM</p>
          <p className="font-bold">{m.name}</p>
        </div>
        <div>
          <p className="font-mono text-xs font-bold text-black/50">EMAIL</p>
          <p className="font-mono text-sm">{m.email}</p>
        </div>
        <div>
          <p className="font-mono text-xs font-bold text-black/50">WANTS TO</p>
          <p className="font-mono text-sm uppercase">{(m as { intent?: string }).intent ?? "—"}</p>
        </div>
        <div>
          <p className="font-mono text-xs font-bold text-black/50">MESSAGE</p>
          <p className="whitespace-pre-wrap">{m.message}</p>
        </div>
        <div className="flex gap-2 pt-2">
          {m.status === "new" && (
            <form action={markRead}>
              <Button type="submit" className="font-mono">MARK AS READ</Button>
            </form>
          )}
          <form action={remove}>
            <Button type="submit" variant="neutral" className="font-mono">DELETE</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
