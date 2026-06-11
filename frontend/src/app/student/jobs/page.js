"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StudentJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyEligible, setShowOnlyEligible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadJobsAndApps = async () => {
    try {
      const jobsData = await apiService.jobs.getAll();
      setJobs(jobsData);
      const appsData = await apiService.applications.getMy();
      setMyApps(appsData);
    } catch (err) {
      console.error("Failed to load jobs/apps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobsAndApps();
  }, []);

  const handleApply = async (jobId) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await apiService.applications.apply(jobId);
      setSuccessMsg("Applied successfully!");
      // reload apps
      const appsData = await apiService.applications.getMy();
      setMyApps(appsData);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to apply.");
      setTimeout(() => setErrorMsg(""), 4500);
    }
  };

  const isApplied = (jobId) => {
    return myApps.some((app) => (app.job?._id || app.job) === jobId);
  };

  const getApplicationStatus = (jobId) => {
    const app = myApps.find((app) => (app.job?._id || app.job) === jobId);
    return app ? app.status : null;
  };

  const checkEligibility = (job) => {
    const reqCGPA = job.company?.eligibilityCGPA;
    if (!reqCGPA) return true;
    if (!user?.cgpa) return false;
    return user.cgpa >= reqCGPA;
  };

  // Search & Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    const companyName = job.company?.companyName?.toLowerCase() || "";
    const matchesSearch =
      job.title?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term) ||
      companyName.includes(term);

    const matchesEligibility = !showOnlyEligible || checkEligibility(job);

    return matchesSearch && matchesEligibility;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl font-bold text-slate-100">Job Board</h2>
        <p className="text-xs text-slate-400 mt-1">Browse and apply to corporate career opportunities</p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-xs text-green-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-slate-850 bg-slate-900/20 py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Eligible */}
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900/20 text-xs text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOnlyEligible}
            onChange={(e) => {
              setShowOnlyEligible(e.target.checked);
              setCurrentPage(1);
            }}
            className="rounded border-slate-800 bg-slate-950 text-blue-500 h-4 w-4 outline-none focus:ring-0 cursor-pointer"
          />
          Show Only Eligible Jobs
        </label>
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 py-16 text-center">
          <p className="text-slate-500 text-xs">No jobs match your search/filter settings.</p>
        </div>
      ) : (
        <>
          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentItems.map((job) => {
              const eligible = checkEligibility(job);
              const applied = isApplied(job._id);
              const appStatus = getApplicationStatus(job._id);

              return (
                <div 
                  key={job._id}
                  className="rounded-2xl border border-slate-850 bg-slate-900/20 p-5 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-3xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                          {job.company?.companyName || "Company"}
                        </span>
                        <h3 className="text-base font-bold text-slate-100 mt-2">
                          {job.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-400">{job.package}</p>
                        <p className="text-3xs text-slate-500 mt-0.5">{job.location}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-5">
                      {job.description}
                    </p>

                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="mb-5">
                        <div className="flex flex-wrap gap-1.5">
                          {job.skillsRequired.map((s, i) => (
                            <span key={i} className="text-3xs bg-slate-950 px-2 py-0.5 rounded text-slate-300 border border-slate-850">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-900/60 pt-4 mt-auto flex items-center justify-between">
                    {/* Eligibility Badge */}
                    <div>
                      {eligible ? (
                        <span className="inline-flex items-center gap-1 text-3xs font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-0.5 rounded-full">
                          ● Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-3xs font-semibold text-red-400 bg-red-500/5 border border-red-500/10 px-2.5 py-0.5 rounded-full">
                          ● Ineligible (Min {job.company?.eligibilityCGPA} CGPA)
                        </span>
                      )}
                    </div>

                    {/* Apply Action */}
                    {applied ? (
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-3xs font-bold border ${
                        appStatus === "Selected" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        appStatus === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        appStatus === "Shortlisted" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        Applied ({appStatus})
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={!eligible}
                        className="select-none rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-3xs py-2 px-4 transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-900 pt-6 mt-4 text-xs font-semibold text-slate-400">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="select-none py-1.5 px-3 rounded-lg border border-slate-850 hover:border-slate-800 bg-slate-950/20 disabled:opacity-40 disabled:pointer-events-none hover:text-slate-200 transition-all outline-none"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="select-none py-1.5 px-3 rounded-lg border border-slate-850 hover:border-slate-800 bg-slate-950/20 disabled:opacity-40 disabled:pointer-events-none hover:text-slate-200 transition-all outline-none"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
