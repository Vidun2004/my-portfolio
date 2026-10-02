import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminMessagesPage() {
  const admin = createAdminClient();
  const { data: messages } = await admin
    .from("contact_messages")
    .select("id, name, email, status, intent, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <p className="font-mono text-sm text-black/50">INBOX</p>
      <h1 className="text-4xl font-bold uppercase">Messages</h1>
      {!messages?.length ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No messages yet.</p>
          <p className="mt-2 font-mono text-sm text-black/50">Send one from the contact form to test.</p>
        </div>
      ) : (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-8 overflow-x-auto border-2">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs">
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">WANTS TO</th>
                <th className="px-4 py-3">EMAIL</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-bold">{m.name}</td>
                  <td className="px-4 py-3 font-mono text-xs uppercase">{(m as { intent?: string }).intent ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{m.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border-2 border-ink bg-cream px-2 py-0.5 font-mono text-[11px] font-bold uppercase">
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/messages/${m.id}`} className="rounded-lg border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs font-bold hover:-translate-y-0.5">
                      VIEW
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
