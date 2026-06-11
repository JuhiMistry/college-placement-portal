"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  
  // Stats state (fetched from public stats API)
  const [stats, setStats] = useState({
    totalStudents: "1,240+",
    totalCompanies: "185+",
    totalJobs: "480+",
    totalApplications: "3,120+",
    studentsPlaced: "960+",
    overallSuccessRate: "85%",
  });

  // Latest jobs state
  const [latestJobs, setLatestJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Testimonials slide state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Load public stats and latest jobs
  useEffect(() => {
    async function loadPublicData() {
      try {
        const statsData = await apiService.public.getStats();
        if (statsData) {
          setStats({
            totalStudents: `${statsData.totalStudents}+`,
            totalCompanies: `${statsData.totalCompanies}+`,
            totalJobs: `${statsData.totalJobs}+`,
            totalApplications: `${statsData.totalApplications}+`,
            studentsPlaced: `${statsData.studentsPlaced}+`,
            overallSuccessRate: `${statsData.overallSuccessRate}%`,
          });
        }
      } catch (err) {
        console.warn("Public stats API offline, using high-fidelity fallback values.");
      }

      try {
        const jobsData = await apiService.public.getLatestJobs();
        if (jobsData && jobsData.length > 0) {
          setLatestJobs(jobsData);
        } else {
          // fallback jobs
          setLatestJobs(fallbackJobs);
        }
      } catch (err) {
        console.warn("Public latest jobs API offline, using fallback opportunities.");
        setLatestJobs(fallbackJobs);
      } finally {
        setLoadingJobs(false);
      }
    }
    loadPublicData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fallbackJobs = [
    {
      _id: "fb1",
      title: "Software Engineer Intern",
      description: "Build scalable web applications using React, Node.js, and cloud systems.",
      location: "Bangalore / Remote",
      package: "12 LPA",
      company: { companyName: "TechCorp Global" },
    },
    {
      _id: "fb2",
      title: "Data Analyst",
      description: "Perform data modeling, configure pipelines, and compile analytics reports.",
      location: "Hyderabad",
      package: "8.5 LPA",
      company: { companyName: "DataGrid Systems" },
    },
    {
      _id: "fb3",
      title: "Associate Product Specialist",
      description: "Coordinate product design workflows, run user research, and structure backlogs.",
      location: "Pune",
      package: "10 LPA",
      company: { companyName: "Innovo Labs" },
    },
  ];

  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Software Development Engineer",
      company: "Google",
      package: "32 LPA",
      text: "The portal's real-time application tracking made it so easy to follow drive updates. The resume check and streamlined dashboard helped me land my dream offer at Google!",
      avatar: "A",
    },
    {
      name: "Ananya Deshmukh",
      role: "Cloud Specialist Associate",
      company: "Microsoft",
      package: "28 LPA",
      text: "Getting placed at Microsoft was amazing. The CGPA eligibility filter was incredibly helpful—I only applied to jobs that matched my profile, saving so much time.",
      avatar: "S",
    },
    {
      name: "Rohan Verma",
      role: "Associate Frontend Developer",
      company: "Amazon",
      package: "22 LPA",
      text: "I loved how mobile-responsive the interface was. I could check mock results, upload revised CVs, and click apply right from my phone between classes.",
      avatar: "R",
    },
  ];

  const milestoneEvents = [
    { date: "June 15", title: "Amazon Campus Hiring Drive", desc: "Online assessment registration deadline." },
    { date: "June 22", title: "Technical Prep Workshop", desc: "Mock coding challenge and interview prep seminar." },
    { date: "July 02", title: "Microsoft Interview Rounds", desc: "Virtual whiteboard design and system assessments." },
    { date: "July 10", title: "Cognizant Placement Drive", desc: "On-campus interviews for Associate Engineers." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden relative">
      {/* Mesh gradients background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_50%)]" />
      <div className="absolute top-[20%] left-[-15%] h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      {/* Header Nav */}
      <header className="relative z-20 border-b border-slate-900 bg-slate-950/20 backdrop-blur-md sticky top-0">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-xl shadow-blue-500/10 border border-blue-400/20">
              P
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              PlacementPortal
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <Link href="/" className="text-slate-100 hover:text-white transition-all">Home</Link>
            <Link href="/login" className="hover:text-white transition-all">Student Portal</Link>
            <Link href="/login" className="hover:text-white transition-all">Admin Portal</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 transition-all active:scale-[0.98] outline-none cursor-pointer"
            >
              {theme === "dark" ? (
                <svg className="h-4.5 w-4.5 text-amber-400 transition-all hover:scale-110 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5 text-indigo-400 transition-all hover:scale-110 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-all py-2 px-4"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 sm:py-32">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <span>🚀 Drive 2026 Campus recruitment active</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-100">
            Launch Your Career Journey with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Centralized placement hub connecting elite students with top global employers. Apply seamlessly, track application pipelines, and manage mock reviews in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto text-center font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 px-8 rounded-xl transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] text-sm"
            >
              Student Registration
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto text-center font-bold bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 py-3.5 px-8 rounded-xl transition-all active:scale-[0.98] text-sm"
            >
              Explore Job Board
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 rounded-2xl border border-slate-900 bg-slate-950/40 p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center md:border-r border-slate-900/60 p-2">
            <p className="text-3xl font-extrabold text-blue-400">{stats.totalStudents}</p>
            <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest mt-2">Total Candidates</p>
          </div>
          <div className="text-center md:border-r border-slate-900/60 p-2">
            <p className="text-3xl font-extrabold text-indigo-400">{stats.totalCompanies}</p>
            <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest mt-2">Hiring Companies</p>
          </div>
          <div className="text-center md:border-r border-slate-900/60 p-2">
            <p className="text-3xl font-extrabold text-purple-400">{stats.totalJobs}</p>
            <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest mt-2">Active Jobs</p>
          </div>
          <div className="text-center md:border-r border-slate-900/60 p-2">
            <p className="text-3xl font-extrabold text-amber-400">{stats.totalApplications}</p>
            <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest mt-2">Apps Filed</p>
          </div>
          <div className="text-center md:border-r border-slate-900/60 p-2">
            <p className="text-3xl font-extrabold text-emerald-400">{stats.studentsPlaced}</p>
            <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest mt-2">Students Placed</p>
          </div>
          <div className="text-center p-2">
            <p className="text-3xl font-extrabold text-pink-400">{stats.overallSuccessRate}</p>
            <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest mt-2">Success Rate</p>
          </div>
        </div>
      </section>

      {/* Latest Opportunities Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">Latest Job Vacancies</h2>
          <p className="text-xs text-slate-400">Apply instantly to recently published roles from our recruiters</p>
        </div>

        {loadingJobs ? (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-350"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-4xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded uppercase">
                      {job.company?.companyName || "Employer"}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{job.package}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mt-2">{job.title}</h3>
                  <p className="text-2xs text-slate-400 leading-relaxed mt-2 line-clamp-3">
                    {job.description}
                  </p>
                </div>
                <div className="border-t border-slate-900/60 pt-4 mt-6 flex items-center justify-between">
                  <span className="text-4xs text-slate-500 font-semibold">{job.location}</span>
                  <Link
                    href="/login"
                    className="select-none rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-4xs py-1.5 px-3 transition-all"
                  >
                    View & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">How It Works</h2>
          <p className="text-xs text-slate-400">Visual guide to the campus hiring drive workflow</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {[
            { step: "01", name: "Register Account", desc: "Create your student or admin profile." },
            { step: "02", name: "Build Profile", desc: "Fill in academic details, branch, and links." },
            { step: "03", name: "Upload CV", desc: "Submit your professional PDF resume portfolio." },
            { step: "04", name: "Explore Jobs", desc: "Filter job listings matching eligibility CGPA." },
            { step: "05", name: "Apply to Roles", desc: "Send applications instantly with one click." },
            { step: "06", name: "Get Hired", desc: "Track drive approvals, interviews, and offers." },
          ].map((item, i) => (
            <div key={i} className="relative rounded-2xl border border-slate-900 bg-slate-950/30 p-5 hover:border-slate-800 transition-all text-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 text-sm font-bold border border-blue-500/15 mb-4">
                {item.step}
              </span>
              <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
              <p className="text-4xs text-slate-500 leading-normal mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Choose Your Portal Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Portal Card */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-8 flex flex-col justify-between hover:border-blue-500/20 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent pointer-events-none" />
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 mb-6 group-hover:scale-105 transition-all">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6M12 20l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Student Workspace</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Register profile parameters, update CV files, explore drive hiring roles, verify CGPA benchmarks, and follow application shortlist status.
              </p>
            </div>
            <Link
              href="/login"
              className="select-none text-center font-bold bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/10"
            >
              Access Student Portal
            </Link>
          </div>

          {/* Admin Portal Card */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-8 flex flex-col justify-between hover:border-purple-500/20 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-transparent pointer-events-none" />
            <div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 mb-6 group-hover:scale-105 transition-all">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Administrator Panel</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Oversee corporate recruiters directory, publish vacancies, evaluate student profile submissions, modify status filters, and monitor placement metrics.
              </p>
            </div>
            <Link
              href="/login"
              className="select-none text-center font-bold bg-purple-600 hover:bg-purple-500 text-white py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/10"
            >
              Access Admin Console
            </Link>
          </div>
        </div>
      </section>

      {/* Recruiter Spotlight & Featured Recruiters Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">Hiring Partners Spotlight</h2>
          <p className="text-xs text-slate-400">Partnering with recruiters from elite organizations globally</p>
        </div>

        {/* Corporate Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { name: "Google", desc: "Premium Hiring Partner", color: "from-red-500/10 to-blue-500/10" },
            { name: "Microsoft", desc: "Elite Recruitment Agency", color: "from-blue-500/10 to-green-500/10" },
            { name: "Amazon", desc: "Cloud Systems & Ops Partner", color: "from-yellow-500/10 to-orange-500/10" },
            { name: "Meta", desc: "Corporate Tech Sponsor", color: "from-blue-600/10 to-indigo-500/10" },
            { name: "Netflix", desc: "Entertainment Systems", color: "from-red-600/10 to-slate-900/10" },
          ].map((c, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border border-slate-900 bg-slate-950/40 p-6 text-center hover:border-slate-800 transition-all cursor-pointer relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-transparent pointer-events-none" />
              <div className="h-10 w-10 mx-auto rounded-full bg-slate-900 flex items-center justify-center font-extrabold text-sm text-slate-300 border border-slate-850 group-hover:scale-105 transition-all">
                {c.name.charAt(0)}
              </div>
              <h4 className="text-xs font-bold text-slate-200 mt-4">{c.name}</h4>
              <p className="text-4xs text-slate-500 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Student Testimonials</h2>
          <p className="text-xs text-slate-400">Success stories from candidates who launched careers via the portal</p>
        </div>

        {/* Carousel Container */}
        <div className="relative rounded-2xl border border-slate-900 bg-slate-950/40 p-8 backdrop-blur-md shadow-2xl min-h-[180px] flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-3xl font-serif text-blue-500/35 pointer-events-none">“</span>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              {testimonials[activeTestimonial].text}
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-900/60">
              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-blue-400 border border-slate-800">
                {testimonials[activeTestimonial].avatar}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">{testimonials[activeTestimonial].name}</p>
                <p className="text-3xs text-slate-500 mt-0.5">
                  Placed as {testimonials[activeTestimonial].role} at <strong className="text-blue-400">{testimonials[activeTestimonial].company}</strong> ({testimonials[activeTestimonial].package})
                </p>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  i === activeTestimonial ? "bg-blue-500 w-3" : "bg-slate-800 hover:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16 border-t border-slate-900/60">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">Why Choose Our Portal?</h2>
          <p className="text-xs text-slate-400">Streamlined tools built for elite educational campus recruitment</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Real-Time Tracking",
              desc: "Follow recruitment application lifecycles from submission to final interview offers.",
            },
            {
              title: "Smart CGPA Filter",
              desc: "Automatic eligibility checks block applications that do not meet GPA requirements.",
            },
            {
              title: "Resume Portfolio",
              desc: "Centralized file upload module keeps student CV copies synced across applications.",
            },
            {
              title: "Analytical Dashboard",
              desc: "Corporate recruiters check analytics counters and placement distributions easily.",
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 hover:border-slate-800 transition-all">
              <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
              <p className="text-4xs text-slate-500 leading-normal mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events & Milestones Calendar */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16 border-t border-slate-900/60">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Placement Timeline & Milestones</h2>
          <p className="text-xs text-slate-400">Key drive dates, prep challenges, and interview schedules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestoneEvents.map((evt, idx) => (
            <div key={idx} className="rounded-xl border border-slate-900 bg-slate-950/30 p-5 flex items-start gap-4 hover:border-slate-800 transition-all">
              <div className="bg-blue-600/10 text-blue-400 border border-blue-500/15 font-extrabold text-xs px-3 py-2 rounded-lg shrink-0">
                {evt.date}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{evt.title}</h4>
                <p className="text-4xs text-slate-500 mt-1 leading-normal">{evt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-900 bg-slate-950/60 pt-16 pb-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 border border-blue-400/20">
                P
              </div>
              <span className="font-extrabold text-sm text-slate-200">
                PlacementPortal
              </span>
            </div>
            <p className="text-4xs text-slate-400 leading-normal max-w-xs">
              A comprehensive system facilitating corporate connections and career advancements for graduating campus candidates.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-2xs font-extrabold text-slate-300 uppercase tracking-widest">Portal Nav</h4>
            <div className="flex flex-col gap-2 font-semibold">
              <Link href="/login" className="hover:text-slate-300">Sign In</Link>
              <Link href="/register" className="hover:text-slate-300">Register</Link>
              <Link href="/login" className="hover:text-slate-300">Browse Jobs</Link>
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="text-2xs font-extrabold text-slate-300 uppercase tracking-widest">Support</h4>
            <p className="text-4xs leading-normal">
              College Placement Cell<br />
              Email: placement@college.edu<br />
              Hours: Mon - Fri, 9 AM - 5 PM
            </p>
          </div>

          {/* Resource Links */}
          <div className="space-y-4">
            <h4 className="text-2xs font-extrabold text-slate-300 uppercase tracking-widest">Information</h4>
            <p className="text-4xs leading-normal">
              Designed as a premium recruiters integration project. Built using Next.js App Router, Express, and MongoDB.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 text-center text-4xs">
          <p>© 2026 College Placement Portal. All rights reserved. Developer credits: Antigravity AI.</p>
        </div>
      </footer>
    </div>
  );
}
