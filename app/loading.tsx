export default function Loading() {
  return (
    <div className="bg-cream text-ink min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="border-ink bg-white shadow-brutal rounded-brutal-lg animate-pulse border-2 p-10">
          <div className="bg-ink/10 h-4 w-32 rounded" />
          <div className="bg-ink/10 mt-4 h-12 w-3/4 rounded" />
          <div className="bg-ink/10 mt-2 h-12 w-1/2 rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="border-ink bg-white shadow-brutal rounded-brutal-md animate-pulse border-2 p-6">
              <div className="bg-ink/10 h-6 w-1/3 rounded" />
              <div className="bg-ink/10 mt-3 h-4 w-full rounded" />
              <div className="bg-ink/10 mt-2 h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
        <p className="text-center font-mono text-xs text-black/40">LOADING…</p>
      </div>
    </div>
  );
}
