function Bar({ className = "" }: { className?: string }) {
  return <div className={`bg-ink/10 rounded ${className}`} />;
}

function SectionHead() {
  return (
    <div>
      <Bar className="h-4 w-64" />
      <Bar className="mt-3 h-12 w-96 max-w-full" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="bg-cream text-ink min-h-screen animate-pulse lg:pl-20">
      {/* hero mirror */}
      <div className="mx-auto grid min-h-svh w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
        <div>
          <Bar className="h-6 w-44 rounded-full" />
          <Bar className="mt-6 h-5 w-48" />
          <Bar className="mt-3 h-20 w-full" />
          <Bar className="h-20 w-4/5" />
          <Bar className="mt-6 h-5 w-3/4" />
          <div className="mt-8 flex gap-4">
            <Bar className="h-11 w-48 rounded-lg" />
            <Bar className="h-11 w-32 rounded-lg" />
          </div>
        </div>
        <div className="border-ink/10 rounded-brutal-lg mx-auto w-full max-w-lg border-2 bg-white p-6">
          <Bar className="h-8 w-full rounded" />
          <Bar className="mt-60 h-72 w-full rounded-xl md:mt-72" />
        </div>
      </div>

      {/* capability cards mirror */}
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10">
        <SectionHead />
        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <div className="border-ink/10 rounded-brutal-md border-2 bg-white p-5 md:col-span-7">
            <Bar className="h-36 w-full rounded-lg" />
            <Bar className="mt-4 h-7 w-1/2" />
          </div>
          <div className="border-ink/10 rounded-brutal-md border-2 bg-white p-5 md:col-span-5">
            <Bar className="h-36 w-full rounded-lg" />
            <Bar className="mt-4 h-7 w-2/3" />
          </div>
        </div>
      </div>
      <p className="pb-10 text-center font-mono text-xs text-black/40">LOADING…</p>
    </div>
  );
}
