import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="bg-cream text-ink flex min-h-screen flex-col items-start justify-center gap-6 p-10">
      <Badge className="font-mono">available for work</Badge>
      <h1 className="text-6xl font-bold tracking-tight uppercase md:text-8xl">
        I build
        <br />
        software
        <br />
        that works.
      </h1>
      <div className="flex gap-4">
        <Button size="lg">Explore my work →</Button>
        <Button size="lg" variant="neutral">
          Let&apos;s talk
        </Button>
      </div>
      <div className="bg-brand-blue border-ink shadow-brutal rounded-brutal-md border-2 p-4 font-mono text-sm">
        token test: blue + hard shadow
      </div>
    </main>
  );
}
