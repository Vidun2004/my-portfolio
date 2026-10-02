function Bar({ className = "" }: { className?: string }) {
  return <div className={`bg-ink/10 rounded ${className}`} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <Bar className="h-4 w-32" />
      <div className="mt-2 flex items-center justify-between">
        <Bar className="h-10 w-56" />
        <Bar className="h-10 w-40 rounded-lg" />
      </div>
      <div className="border-ink/10 rounded-brutal-md mt-6 border-2 bg-white p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="border-ink/5 flex items-center gap-4 border-b py-3.5 last:border-0">
            <Bar className="h-5 w-1/4" />
            <Bar className="hidden h-5 w-1/5 sm:block" />
            <Bar className="h-5 flex-1" />
            <Bar className="h-7 w-24 shrink-0 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="animate-pulse">
      <Bar className="h-4 w-32" />
      <Bar className="mt-2 h-10 w-64" />
      <div className="border-ink/10 rounded-brutal-md mt-6 space-y-5 border-2 bg-white p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Bar className="h-10 w-full rounded-lg" />
          <Bar className="h-10 w-full rounded-lg" />
        </div>
        <Bar className="h-20 w-full rounded-lg" />
        <Bar className="h-10 w-full rounded-lg" />
        <Bar className="h-11 w-44 rounded-lg" />
      </div>
    </div>
  );
}

export function GridSkeleton({ tiles = 6 }: { tiles?: number }) {
  return (
    <div className="animate-pulse">
      <Bar className="h-4 w-32" />
      <Bar className="mt-2 h-10 w-48" />
      <div className="border-ink/10 rounded-brutal-md mt-6 border-2 bg-white p-5">
        <Bar className="h-10 w-full max-w-md rounded-lg" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: tiles }).map((_, i) => (
          <div key={i} className="border-ink/10 rounded-brutal-md border-2 bg-white p-3">
            <Bar className="h-32 w-full rounded" />
            <Bar className="mt-3 h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeedSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <Bar className="h-4 w-32" />
      <Bar className="mt-2 h-10 w-52" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="border-ink/10 rounded-brutal-md flex items-center gap-3 border-2 bg-white px-4 py-3.5">
            <Bar className="h-5 w-24 rounded-full" />
            <Bar className="h-5 flex-1 rounded" />
            <Bar className="h-4 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <Bar className="h-4 w-40" />
      <Bar className="mt-2 h-12 w-80" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-ink/10 rounded-brutal-md border-2 bg-white p-5">
            <Bar className="h-4 w-24 rounded" />
            <Bar className="mt-2 h-12 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border-ink/10 rounded-brutal-md border-2 bg-white p-5">
          <Bar className="h-4 w-32 rounded" />
          {[0, 1, 2, 3].map((i) => (
            <Bar key={i} className="mt-3 h-8 w-full rounded-lg" />
          ))}
        </div>
        <div className="space-y-6">
          <div className="border-ink/10 rounded-brutal-md border-2 bg-white p-5">
            <Bar className="h-4 w-32 rounded" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Bar key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="border-ink/10 rounded-brutal-md border-2 bg-white p-5">
            <Bar className="h-4 w-32 rounded" />
            {[0, 1, 2].map((i) => (
              <Bar key={i} className="mt-3 h-5 w-full rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
