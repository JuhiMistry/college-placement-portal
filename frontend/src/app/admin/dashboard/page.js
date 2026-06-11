"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadDashboardData() {
      try {
        const analyticsData = await apiService.analytics.get();
        setStats(analyticsData);

        const apps = await apiService.applications.getAll();
        setRecentApps(apps.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <h2 className="text-2xl font-bold text-slate-100">Welcome, Administrator</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
          Monitor and coordinate recruitment drives. Track student submissions, publish job opportunities, register corporate recruiters, and view placement performance analytics.
        </p>
      </div>

      {/* Advanced Stats Cards (8 Cards) */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            color="blue"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Companies"
            value={stats.totalCompanies}
            color="indigo"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <StatsCard
            title="Job Roles"
            value={stats.totalJobs}
            color="purple"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Applications"
            value={stats.totalApplications}
            color="amber"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
          />
          <StatsCard
            title="Total Interviews"
            value={stats.totalInterviews}
            color="pink"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Shortlisted"
            value={stats.shortlistedStudents}
            color="violet"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Selected Students"
            value={stats.selectedStudents}
            color="emerald"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
          <StatsCard
            title="Placement Rate"
            value={`${stats.placementRate}%`}
            color="sky"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
      )}

      {/* Grid: Charts & Analytics Summary */}
      {mounted && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Applications Chart */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Monthly Applications Filed</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyApplications}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#172237",
                      borderColor: "#1f2e4a",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                      fontSize: "11px"
                    }}
                  />
                  <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interview Trends Chart */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Interview Activity Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.interviewTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2e4a" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#172237",
                      borderColor: "#1f2e4a",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                      fontSize: "11px"
                    }}
                  />
                  <Line type="monotone" dataKey="interviews" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Recent Applications & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-900/20 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-200">Recent Student Applications</h3>
              <Link href="/admin/applications" className="text-2xs font-semibold text-blue-400 hover:text-blue-300 transition-all">
                View All
              </Link>
            </div>
            {recentApps.length === 0 ? (
              <p className="text-slate-500 text-xs py-8 text-center">No applications submitted yet.</p>
            ) : (
              <div className="divide-y divide-slate-900 text-xs text-slate-300">
                {recentApps.map((app) => (
                  <div key={app._id} className="py-3 flex items-center justify-between hover:bg-slate-900/10 px-2 rounded-lg transition-all">
                    <div>
                      <p className="font-semibold text-slate-100">{app.student?.name || "Student"}</p>
                      <p className="text-3xs text-slate-500 mt-0.5">{app.job?.title} • {app.job?.company?.companyName}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-3xs font-semibold border ${
                      app.status === "Selected" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      app.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      app.status === "Shortlisted" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Administrative Controls</h3>
          
          <div className="grid grid-cols-1 gap-2.5 text-xs font-semibold">
            <Link 
              href="/admin/interviews" 
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-850 hover:border-slate-800 bg-slate-950/20 hover:bg-slate-900/30 transition-all text-slate-300 hover:text-slate-100 active:scale-[0.98]"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Manage Interviews
            </Link>

            <Link 
              href="/admin/offer-letters" 
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-850 hover:border-slate-800 bg-slate-950/20 hover:bg-slate-900/30 transition-all text-slate-300 hover:text-slate-100 active:scale-[0.98]"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Offer Letter Dashboard
            </Link>

            <Link 
              href="/admin/jobs" 
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-850 hover:border-slate-800 bg-slate-950/20 hover:bg-slate-900/30 transition-all text-slate-300 hover:text-slate-100 active:scale-[0.98]"
            >
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              Post Job Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
