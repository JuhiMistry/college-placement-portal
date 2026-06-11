export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 bg-slate-800 rounded" />
          <div className="h-3 w-1/4 bg-slate-800 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-800 rounded" />
        <div className="h-3 w-5/6 bg-slate-800 rounded" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 w-16 bg-slate-800 rounded-full" />
        <div className="h-8 w-24 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}
