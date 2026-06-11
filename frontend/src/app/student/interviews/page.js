"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import SkeletonCard from "@/components/SkeletonCard";

export default function StudentInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInterviews() {
      try {
        const data = await apiService.interviews.getMy();
        setInterviews(data);
      } catch (err) {
        console.error("Failed to load student interviews:", err);
        setError("Could not retrieve interview schedule. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, []);

  const getCountdown = (dateStr, timeStr) => {
    const interviewDate = new Date(dateStr);
    const now = new Date();
    
    // Parse time if format is HH:MM
    const [hours, minutes] = timeStr.split(":");
    if (hours !== undefined && minutes !== undefined) {
      interviewDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    const diffMs = interviewDate - now;
    if (diffMs < 0) {
      if (Math.abs(diffMs) < 2 * 60 * 60 * 1000) {
        return { text: "Happening now", type: "active" };
      }
      return { text: "Completed", type: "past" };
    }

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffDays > 0) {
      return { text: `In ${diffDays} day${diffDays > 1 ? "s" : ""}`, type: "future" };
    }
    if (diffHrs > 0) {
      return { text: `In ${diffHrs} hour${diffHrs > 1 ? "s" : ""}`, type: "today" };
    }
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return { text: `In ${diffMins} min${diffMins > 1 ? "s" : ""}`, type: "soon" };
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-900 pb-5">
          <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-64 bg-slate-800 rounded mt-2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">My Schedules & Interviews</h2>
          <p className="text-xs text-slate-400 mt-1">Track upcoming evaluations, live screening, and recruitment evaluations</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {interviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-12 text-center max-w-xl mx-auto flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-200">No interviews scheduled yet</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
            Once a partner company reviews your application and moves you to the screening round, your details will display here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((item) => {
            const countdown = getCountdown(item.date, item.time);
            
            return (
              <div
                key={item._id}
                className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/20 p-6 flex flex-col justify-between hover:border-slate-800 transition-all shadow-xl hover:-translate-y-0.5 duration-350"
              >
                <div>
                  {/* Company & Role */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{item.job?.title || "Role Interview"}</h4>
                      <p className="text-2xs text-slate-400 font-semibold mt-0.5">{item.company?.companyName}</p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      item.status === "Cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      item.status === "Completed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Mode & Details */}
                  <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(item.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span className={`font-semibold ${item.mode === "Online" ? "text-indigo-400" : "text-amber-400"}`}>
                        {item.mode} Interview
                      </span>
                    </div>
                  </div>
                </div>

                {/* Countdown and Action */}
                <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between gap-4">
                  {/* Countdown */}
                  {item.status === "Scheduled" && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      countdown.type === "today" || countdown.type === "soon" || countdown.type === "active"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-slate-950 text-slate-500 border border-slate-900"
                    }`}>
                      {countdown.text}
                    </span>
                  )}
                  {item.status !== "Scheduled" && <span className="h-2" />}

                  {/* Join Link */}
                  {item.mode === "Online" && item.status === "Scheduled" && item.meetingLink ? (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-blue-600 hover:bg-blue-500 text-2xs font-bold px-4 py-2 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Join Meeting
                    </a>
                  ) : item.mode === "Offline" ? (
                    <span className="text-3xs text-slate-500 font-semibold uppercase tracking-wider">In-Person Drive</span>
                  ) : (
                    <span className="text-3xs text-slate-500 font-semibold uppercase tracking-wider">No Link Posted</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
