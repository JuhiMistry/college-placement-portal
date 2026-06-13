"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StudentApplications() {
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await apiService.applications.getMy();
        setMyApps(data);
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl font-bold text-slate-100">My Job Applications</h2>
        <p className="text-xs text-slate-400 mt-1">Track the status of your submitted job profiles</p>
      </div>

      {myApps.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 py-16 text-center">
          <p className="text-slate-500 text-xs">You haven't submitted any job applications yet.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< 768px) */}
          <div className="block md:hidden space-y-4">
            {myApps.map((app) => (
              <div 
                key={app._id} 
                className="p-5 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-3xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                      {app.job?.company?.companyName || "N/A"}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 mt-2">{app.job?.title || "N/A"}</h4>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-3xs font-bold border shrink-0 ${
                    app.status === "Selected" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    app.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    app.status === "Shortlisted" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                    "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-3xs text-slate-400 border-t border-slate-900/60 pt-3">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold uppercase">Package</span>
                    <span className="text-xs font-medium text-emerald-400">{app.job?.package || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold uppercase">Applied Date</span>
                    <span className="text-xs font-medium text-slate-300">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Table View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-slate-400 text-3xs font-bold uppercase tracking-wider sticky-header">
                  <th className="p-4 pl-6">Employer</th>
                  <th className="p-4">Job Role</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 pr-6 text-right">Application Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
                {myApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-900/25 transition-all">
                    <td className="p-4 pl-6 font-bold text-slate-100">
                      {app.job?.company?.companyName || "N/A"}
                    </td>
                    <td className="p-4">{app.job?.title || "N/A"}</td>
                    <td className="p-4 text-slate-400">{app.job?.package || "N/A"}</td>
                    <td className="p-4 text-slate-500">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-3xs font-bold border ${
                        app.status === "Selected" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        app.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        app.status === "Shortlisted" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
