"use client";

import { useEffect, useState, useMemo } from "react";
import { apiService } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Filters
  const [branchFilter, setBranchFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setMounted(true);
    async function loadStats() {
      try {
        const data = await apiService.analytics.get();
        setStats(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Filtered Branch Stats
  const filteredBranchData = useMemo(() => {
    if (!stats?.branchStats) return [];
    if (branchFilter === "All") return stats.branchStats;
    return stats.branchStats.filter(item => item.branch === branchFilter);
  }, [stats, branchFilter]);

  // Color Palette for Pie Chart
  const COLORS = ["#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#eab308", "#10b981", "#14b8a6"];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Derived metrics
  const placementRate = stats?.totalStudents > 0 
    ? Math.round((stats.selectedStudents / stats.totalStudents) * 100) 
    : 0;

  const appPerStudent = stats?.totalStudents > 0
    ? (stats.totalApplications / stats.totalStudents).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-900 pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Placement Performance & Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">Platform analytics and recruitment campaign insights</p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2 text-xs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl bg-slate-900/40 border border-slate-850 px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl bg-slate-900/40 border border-slate-850 px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <StatsCard
            title="Registered Candidates"
            value={stats.totalStudents}
            color="blue"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Partner Employers"
            value={stats.totalCompanies}
            color="indigo"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <StatsCard
            title="Active Job Listings"
            value={stats.totalJobs}
            color="purple"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Selected Students"
            value={stats.selectedStudents}
            color="emerald"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Main Visualizations Grid */}
      {mounted && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Monthly Application Volume */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Monthly Candidate Submissions</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyApplications}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2e4a" vertical={false} />
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
                  <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interview Volumes Trends */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Interview Evaluations Activity</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.interviewTrends}>
                  <defs>
                    <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area type="monotone" dataKey="interviews" stroke="#a855f7" fillOpacity={1} fill="url(#colorInterviews)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Branch Statistics (Pie / Donut) */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="text-sm font-bold text-slate-200">Placements by Branch</h3>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-850 px-3 py-1.5 text-2xs text-slate-300 focus:outline-none"
              >
                <option value="All">All Branches</option>
                {stats.branchStats.map(b => (
                  <option key={b.branch} value={b.branch}>{b.branch}</option>
                ))}
              </select>
            </div>

            <div className="h-72 flex flex-col sm:flex-row items-center justify-around gap-4">
              <div className="h-56 w-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredBranchData}
                      dataKey="placed"
                      nameKey="branch"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {filteredBranchData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#172237",
                        borderColor: "#1f2e4a",
                        borderRadius: "12px",
                        color: "#f1f5f9",
                        fontSize: "11px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="space-y-2 text-2xs">
                {filteredBranchData.map((item, idx) => (
                  <div key={item.branch} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-300 font-semibold">{item.branch}</span>
                    <span className="text-slate-500">• {item.placed} Placed ({item.rate}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hiring Volume by Employer */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Top Hiring Partners</h3>
            <div className="h-72">
              {stats.companyHiring.length === 0 ? (
                <p className="text-slate-500 text-xs py-16 text-center">No hire stats recorded yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.companyHiring} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2e4a" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis dataKey="company" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#172237",
                        borderColor: "#1f2e4a",
                        borderRadius: "12px",
                        color: "#f1f5f9",
                        fontSize: "11px"
                      }}
                    />
                    <Bar dataKey="selections" fill="#10b981" radius={[0, 4, 4, 0]} barSize={15} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Ratios and Summary Metrics */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-center">
            <p className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Placement Ratio</p>
            <h4 className="text-xl font-extrabold text-blue-400 mt-1">{placementRate}%</h4>
            <p className="text-4xs text-slate-500 mt-1">Percentage of all registered candidates placed</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-center">
            <p className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Average Apps / Student</p>
            <h4 className="text-xl font-extrabold text-purple-400 mt-1">{appPerStudent}</h4>
            <p className="text-4xs text-slate-500 mt-1">Application submission density per user</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-center">
            <p className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Opportunity Density</p>
            <h4 className="text-xl font-extrabold text-emerald-400 mt-1">
              {stats.totalStudents > 0 ? (stats.totalJobs / stats.totalStudents).toFixed(2) : 0}
            </h4>
            <p className="text-4xs text-slate-500 mt-1">Available job roles per candidate</p>
          </div>
        </div>
      )}
    </div>
  );
}
