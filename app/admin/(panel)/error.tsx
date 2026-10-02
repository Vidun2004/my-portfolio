"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="border-ink bg-white shadow-brutal rounded-brutal-md max-w-md border-2 p-8 text-center">
      <p className="font-mono text-sm font-bold text-black/40">ADMIN ERROR</p>
      <p className="mt-2 font-bold">Something went wrong loading this panel.</p>
      <Button onClick={reset} className="mt-4 font-mono">TRY AGAIN</Button>
    </div>
  );
}
