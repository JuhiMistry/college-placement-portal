export default function StatsCard({ title, value, icon, color = "blue" }) {
  const colorMaps = {
    blue: {
      bg: "bg-blue-600/10",
      text: "text-blue-400",
      border: "border-blue-500/10",
      glow: "shadow-blue-500/5",
    },
    indigo: {
      bg: "bg-indigo-600/10",
      text: "text-indigo-400",
      border: "border-indigo-500/10",
      glow: "shadow-indigo-500/5",
    },
    purple: {
      bg: "bg-purple-600/10",
      text: "text-purple-400",
      border: "border-purple-500/10",
      glow: "shadow-purple-500/5",
    },
    amber: {
      bg: "bg-amber-600/10",
      text: "text-amber-400",
      border: "border-amber-500/10",
      glow: "shadow-amber-500/5",
    },
    emerald: {
      bg: "bg-emerald-600/10",
      text: "text-emerald-400",
      border: "border-emerald-500/10",
      glow: "shadow-emerald-500/5",
    },
    pink: {
      bg: "bg-pink-600/10",
      text: "text-pink-400",
      border: "border-pink-500/10",
      glow: "shadow-pink-500/5",
    },
    violet: {
      bg: "bg-violet-600/10",
      text: "text-violet-400",
      border: "border-violet-500/10",
      glow: "shadow-violet-500/5",
    },
    sky: {
      bg: "bg-sky-600/10",
      text: "text-sky-400",
      border: "border-sky-500/10",
      glow: "shadow-sky-500/5",
    },
  };

  const scheme = colorMaps[color] || colorMaps.blue;

  return (
    <div className={`relative rounded-2xl border ${scheme.border} bg-slate-900/30 p-4 sm:p-6 flex flex-col justify-between hover:border-slate-800/80 transition-all hover:-translate-y-0.5 duration-350 shadow-md ${scheme.glow}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-3xs font-bold uppercase tracking-widest text-slate-500 truncate">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2 tracking-tight truncate">{value}</h3>
        </div>
        
        {icon && (
          <div className={`inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${scheme.bg} ${scheme.text} shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
