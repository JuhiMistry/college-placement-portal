"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { apiService } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [myApps, setMyApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      try {
        const [apps, inters, offerLetters] = await Promise.all([
          apiService.applications.getMy(),
          apiService.interviews.getMy(),
          apiService.offerLetters.getMy()
        ]);
        setMyApps(apps);
        setInterviews(inters);
        setOffers(offerLetters);
      } catch (err) {
        console.error("Failed to load student dashboard applications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, []);

  // Filter interviews today
  const todayInterviews = useMemo(() => {
    const todayStr = new Date().toDateString();
    return interviews.filter(
      (item) => item.status === "Scheduled" && new Date(item.date).toDateString() === todayStr
    );
  }, [interviews]);

  // Upcoming interviews
  const upcomingInterviews = useMemo(() => {
    const now = new Date();
    return interviews
      .filter((item) => item.status === "Scheduled" && new Date(item.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [interviews]);

  // Derived counts
  const shortlistCount = myApps.filter((a) => a.status === "Shortlisted").length;
  const selectedCount = myApps.filter((a) => a.status === "Selected").length;
  const pendingCount = myApps.filter((a) => a.status === "Pending").length;
  const isResumeUploaded = !!user?.resumeUrl;

  // Most recent application for timeline
  const activeApplication = useMemo(() => {
    if (myApps.length === 0) return null;
    return [...myApps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }, [myApps]);

  // Combine notifications & apps to generate a Recent Activity Feed
  const recentActivities = useMemo(() => {
    const feed = [];

    myApps.forEach(app => {
      feed.push({
        id: `app-${app._id}`,
        title: "Applied to Job Position",
        desc: `Submitted application for ${app.job?.title} at ${app.job?.company?.companyName || "company"}.`,
        time: new Date(app.createdAt),
        type: "apply"
      });
    });

    interviews.forEach(inter => {
      feed.push({
        id: `inter-${inter._id}`,
        title: `Interview Scheduled (${inter.status})`,
        desc: `Screening evaluation for ${inter.job?.title} with ${inter.company?.companyName}.`,
        time: new Date(inter.createdAt),
        type: "interview"
      });
    });

    offers.forEach(off => {
      feed.push({
        id: `offer-${off._id}`,
        title: `Placement Offer Letter (${off.status})`,
        desc: `CTC: ${off.salary} LPA for ${off.job?.title} at ${off.company?.companyName}.`,
        time: new Date(off.createdAt),
        type: "offer"
      });
    });

    return feed.sort((a, b) => b.time - a.time).slice(0, 4);
  }, [myApps, interviews, offers]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Today Interview Banner Alert */}
      {todayInterviews.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 shadow-xl backdrop-blur-xl animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-200">Interview Scheduled For Today!</h3>
              <p className="text-xs text-slate-300 mt-1 leading-normal">
                You have {todayInterviews.length} interview{todayInterviews.length > 1 ? "s" : ""} scheduled today. 
                {todayInterviews[0].mode === "Online" && todayInterviews[0].meetingLink ? (
                  <span> The session starts at <strong className="text-white">{todayInterviews[0].time}</strong>. Click <a href={todayInterviews[0].meetingLink} target="_blank" rel="noreferrer" className="text-blue-400 font-bold underline">Join Meeting</a> to connect.</span>
                ) : (
                  <span> The drive starts at <strong className="text-white">{todayInterviews[0].time}</strong> (In-person evaluation).</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <h2 className="text-2xl font-bold text-slate-100">Welcome, {user?.name || "Student"}</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
          Manage your placement portfolio. Edit your details, keep your resume updated, explore active job postings, and track real-time recruitment drive reviews.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <StatsCard
          title="Applications Filed"
          value={myApps.length}
          color="blue"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        />
        <StatsCard
          title="Shortlists"
          value={shortlistCount}
          color="indigo"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Offers Received"
          value={selectedCount}
          color="emerald"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatsCard
          title="Resume Status"
          value={isResumeUploaded ? "Verified" : "Missing"}
          color={isResumeUploaded ? "emerald" : "amber"}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Grid: Upcoming Interviews & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Timeline & Widgets */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Application Status Timeline */}
          {activeApplication && (
            <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-slate-200">Active Application Tracking</h3>
                <span className="text-3xs font-bold text-slate-500 uppercase tracking-wide truncate max-w-[150px] sm:max-w-none">
                  {activeApplication.job?.title} • {activeApplication.job?.company?.companyName}
                </span>
              </div>

              {/* Steps Layout */}
              <div className="flex items-center justify-between w-full relative">
                {/* Background Connecting Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-10" />
                <div 
                  className="absolute top-4 left-4 h-0.5 bg-blue-500 -z-10 transition-all duration-500" 
                  style={{
                    width: activeApplication.status === "Selected" ? "100%" :
                           activeApplication.status === "Rejected" ? "100%" :
                           activeApplication.status === "Shortlisted" ? "50%" : "0%"
                  }}
                />

                {/* Step 1: Applied */}
                <div className="text-center flex flex-col items-center w-20 sm:w-24">
                  <div className="h-8.5 w-8.5 rounded-full bg-blue-600 border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold font-sans shadow-lg shadow-blue-500/20">
                    ✓
                  </div>
                  <p className="text-3xs font-bold text-slate-300 mt-2 truncate w-full">Applied</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{new Date(activeApplication.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}</p>
                </div>

                {/* Step 2: Evaluation / Shortlist */}
                <div className="text-center flex flex-col items-center w-20 sm:w-24">
                  <div className={`h-8.5 w-8.5 rounded-full border-2 border-slate-950 flex items-center justify-center text-xs font-bold font-sans shadow-md ${
                    activeApplication.status === "Shortlisted" || activeApplication.status === "Selected" || activeApplication.status === "Rejected"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}>
                    2
                  </div>
                  <p className={`text-3xs font-bold mt-2 truncate w-full ${
                    activeApplication.status === "Shortlisted" || activeApplication.status === "Selected" || activeApplication.status === "Rejected"
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}>Shortlisted</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 truncate w-full">Evaluation</p>
                </div>

                {/* Step 3: Final Selection */}
                <div className="text-center flex flex-col items-center w-20 sm:w-24">
                  <div className={`h-8.5 w-8.5 rounded-full border-2 border-slate-950 flex items-center justify-center text-xs font-bold font-sans shadow-md ${
                    activeApplication.status === "Selected" ? "bg-emerald-600 text-white" :
                    activeApplication.status === "Rejected" ? "bg-red-600 text-white" :
                    "bg-slate-900 border-slate-800 text-slate-500"
                  }`}>
                    {activeApplication.status === "Selected" ? "✓" : activeApplication.status === "Rejected" ? "✗" : "3"}
                  </div>
                  <p className={`text-3xs font-bold mt-2 truncate w-full ${
                    activeApplication.status === "Selected" ? "text-emerald-400 font-extrabold" :
                    activeApplication.status === "Rejected" ? "text-red-400 font-extrabold" :
                    "text-slate-500"
                  }`}>
                    {activeApplication.status === "Rejected" ? "Rejected" : "Selected"}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5 truncate w-full">Final Status</p>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Interviews List */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="text-sm font-bold text-slate-200">Upcoming Interviews</h3>
              <Link href="/student/interviews" className="text-2xs font-semibold text-blue-400 hover:text-blue-300 transition-all">
                View Calendar
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <p className="text-slate-500 text-xs py-5 text-center">No upcoming interviews scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingInterviews.map((item) => (
                  <div key={item._id} className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 space-y-3 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-100 leading-snug">{item.job?.title}</p>
                      <p className="text-3xs font-semibold text-slate-400 mt-0.5">{item.company?.companyName}</p>
                      <div className="mt-3.5 space-y-1 text-3xs text-slate-400">
                        <p>Date: {new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric" })} • {item.time}</p>
                        <p>Mode: <span className="font-semibold text-blue-400">{item.mode}</span></p>
                      </div>
                    </div>
                    {item.mode === "Online" && item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-center py-2 text-[10px] font-bold text-white shadow-md shadow-blue-500/10 cursor-pointer block"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Feed widgets */}
        <div className="space-y-8">
          
          {/* Recent Notifications Widget */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Unread Notifications</h3>
            
            <div className="space-y-3">
              {notifications.filter(n => !n.read).slice(0, 3).length === 0 ? (
                <p className="text-slate-500 text-xs py-5 text-center">All caught up!</p>
              ) : (
                notifications.filter(n => !n.read).slice(0, 3).map((item) => (
                  <div key={item._id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-2xs font-bold text-slate-200">{item.title}</p>
                      <p className="text-3xs text-slate-400 mt-0.5 leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Recent Activity</h3>
            
            <div className="space-y-4 text-xs">
              {recentActivities.length === 0 ? (
                <p className="text-slate-500 text-xs py-5 text-center">No recent activity.</p>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="flex gap-3 relative last:after:hidden after:absolute after:top-6 after:left-3 after:bottom-[-20px] after:w-px after:bg-slate-900">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 border ${
                      act.type === "apply" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      act.type === "interview" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      <span className="text-[10px] font-sans font-bold">•</span>
                    </div>
                    <div>
                      <p className="text-3xs font-bold text-slate-200">{act.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{act.desc}</p>
                      <p className="text-[9px] text-slate-600 mt-1">
                        {act.time.toLocaleDateString([], { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
