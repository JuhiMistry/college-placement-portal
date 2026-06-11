export default function SkeletonTable({ rows = 5 }) {
  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-900/10 overflow-hidden animate-pulse">
      <div className="h-10 bg-slate-900/40 border-b border-slate-900" />
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-900/40 last:border-0 pb-3 last:pb-0">
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-1/4 bg-slate-800 rounded" />
              <div className="h-3 w-1/3 bg-slate-800 rounded" />
            </div>
            <div className="h-4 w-20 bg-slate-800 rounded mx-4" />
            <div className="h-6 w-16 bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
