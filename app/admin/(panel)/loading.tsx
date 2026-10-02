export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-ink/10 h-4 w-32 rounded" />
      <div className="bg-ink/10 h-10 w-72 rounded" />
      <div className="border-ink/10 rounded-brutal-md border-2 bg-white p-6">
        <div className="bg-ink/10 h-5 w-full rounded" />
        <div className="bg-ink/10 mt-3 h-5 w-5/6 rounded" />
        <div className="bg-ink/10 mt-3 h-5 w-2/3 rounded" />
      </div>
    </div>
  );
}
