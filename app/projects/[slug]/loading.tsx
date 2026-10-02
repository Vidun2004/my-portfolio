function Bar({ className = "" }: { className?: string }) {
  return <div className={`bg-ink/10 rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="bg-cream text-ink min-h-screen animate-pulse lg:pl-20">
      <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 md:px-10">
        <Bar className="h-4 w-32" />
        <Bar className="mt-8 h-4 w-72" />
        <Bar className="mt-3 h-16 w-3/4" />
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <Bar key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
        <Bar className="border-ink/10 rounded-brutal-lg mt-8 min-h-72 w-full border-2 md:min-h-[420px]" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <Bar className="h-5 w-full" />
            <div className="mt-8 min-h-[40vh] rounded-brutal-md border-2 border-ink/10 bg-white p-6">
              <Bar className="h-4 w-16" />
              <Bar className="mt-2 h-9 w-2/3" />
              <Bar className="mt-4 h-4 w-full" />
              <Bar className="mt-2 h-4 w-5/6" />
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
