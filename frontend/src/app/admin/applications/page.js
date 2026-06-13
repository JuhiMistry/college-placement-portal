"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadApplications = async () => {
    try {
      const data = await apiService.applications.getAll();
      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const updated = await apiService.applications.updateStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: updated.status } : app))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Search & Filter Logic
  const filteredApps = applications.filter((app) => {
    const term = searchTerm.toLowerCase();
    const studentName = app.student?.name?.toLowerCase() || "";
    const studentEmail = app.student?.email?.toLowerCase() || "";
    const jobTitle = app.job?.title?.toLowerCase() || "";
    const companyName = app.job?.company?.companyName?.toLowerCase() || "";
    
    const matchesSearch =
      studentName.includes(term) ||
      studentEmail.includes(term) ||
      jobTitle.includes(term) ||
      companyName.includes(term);

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApps.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "text-green-400 border-green-500/20";
      case "Rejected":
        return "text-red-400 border-red-500/20";
      case "Shortlisted":
        return "text-indigo-400 border-indigo-500/20";
      default:
        return "text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl font-bold text-slate-100">Student Applications</h2>
        <p className="text-xs text-slate-400 mt-1">Review candidate resumes and update shortlists</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by student name, job title, company..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-slate-850 bg-slate-900/20 py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-slate-850 bg-slate-900/20 py-2.5 px-4 text-xs text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
          <option value="Selected">Selected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 py-16 text-center">
          <p className="text-slate-500 text-xs">No candidate applications found.</p>
        </div>
      ) : (
        <>
          {/* Applications Table (Desktop/Tablet) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md max-h-[600px] scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead className="sticky-header">
                <tr className="border-b border-slate-900 bg-slate-950/40 text-slate-400 text-3xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Student Details</th>
                  <th className="p-4">Branch & CGPA</th>
                  <th className="p-4">Resume</th>
                  <th className="p-4">Opportunity</th>
                  <th className="p-4 pr-6 text-right">Placement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
                {currentItems.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-900/25 transition-all">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-100">{app.student?.name || "N/A"}</div>
                      <div className="text-3xs text-slate-500 mt-0.5">{app.student?.email || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div>{app.student?.branch || "N/A"}</div>
                      <div className="text-3xs text-slate-400 mt-0.5">CGPA: {app.student?.cgpa || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      {app.student?.resumeUrl ? (
                        <a
                          href={`${API_BASE_URL.replace("/api", "")}/uploads/${app.student.resumeUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-400 hover:text-blue-300 transition-all hover:underline"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-slate-600">No Resume</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{app.job?.title || "N/A"}</div>
                      <div className="text-3xs text-slate-500 mt-0.5">{app.job?.company?.companyName || "N/A"}</div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`rounded-lg py-1.5 px-3 text-3xs font-bold outline-none border cursor-pointer bg-slate-950 ${getStatusColor(app.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dedicated Card Layout for Mobile */}
          <div className="md:hidden space-y-4">
            {currentItems.map((app) => (
              <div key={app._id} className="rounded-2xl border border-slate-900 bg-slate-900/20 p-4 space-y-3 shadow-md">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-100 truncate">{app.student?.name || "N/A"}</h4>
                    <p className="text-3xs text-slate-500 mt-0.5 truncate">{app.student?.email || "N/A"}</p>
                  </div>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className={`rounded-lg py-1.5 px-2.5 text-3xs font-bold outline-none border cursor-pointer bg-slate-950 shrink-0 ${getStatusColor(app.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                  </select>
                </div>

                <div className="text-2xs text-slate-300 space-y-2 border-t border-slate-900/60 pt-2.5">
                  <div>
                    <span className="text-slate-500 font-medium">Academics: </span>
                    <span className="text-slate-200">{app.student?.branch || "N/A"} (CGPA: {app.student?.cgpa || "N/A"})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Opportunity: </span>
                    <span className="text-slate-200 font-semibold">{app.job?.title || "N/A"}</span>
                    <span className="text-slate-400"> ({app.job?.company?.companyName || "N/A"})</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-3xs text-slate-500 pt-2 border-t border-slate-900/60">
                  {app.student?.resumeUrl ? (
                    <a
                      href={`${API_BASE_URL.replace("/api", "")}/uploads/${app.student.resumeUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-400 hover:text-blue-300 transition-all hover:underline min-h-[30px] flex items-center"
                    >
                      View PDF Resume
                    </a>
                  ) : (
                    <span className="text-slate-600 font-bold">No Resume</span>
                  )}
                  <span>Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            ))}
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
