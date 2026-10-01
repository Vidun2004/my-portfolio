import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-cream text-ink flex min-h-screen items-center justify-center p-6">
      <div className="border-ink bg-white shadow-brutal-lg rounded-brutal-lg max-w-md border-2 p-10 text-center">
        <p className="font-mono text-sm font-bold text-black/40">404</p>
        <h1 className="mt-2 text-4xl font-bold uppercase">Something went missing.</h1>
        <p className="mt-3 font-mono text-sm text-black/60">
          That page doesn&apos;t exist — or moved.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button size="lg" className="font-mono">BACK HOME</Button>
        </Link>
      </div>
    </div>
  );
}
