"use client";

import { useEffect, useState, useMemo } from "react";
import { apiService } from "@/lib/api";
import { useNotifications } from "@/context/NotificationContext";
import SkeletonTable from "@/components/SkeletonTable";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminInterviews() {
  const { fetchNotifications } = useNotifications();
  
  // Data lists
  const [interviews, setInterviews] = useState([]);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // If editing
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewMode, setInterviewMode] = useState("Online");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviewStatus, setInterviewStatus] = useState("Scheduled");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [interList, studList, jobList] = await Promise.all([
        apiService.interviews.getAll(),
        apiService.admin.getStudents(),
        apiService.jobs.getAll()
      ]);
      setInterviews(interList);
      setStudents(studList);
      setJobs(jobList);
    } catch (err) {
      console.error("Failed to load interview dashboard data:", err);
      setError("Failed to fetch placement database details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const studentName = item.student?.name || "";
      const companyName = item.company?.companyName || "";
      const jobTitle = item.job?.title || "";
      
      const matchesSearch =
        studentName.toLowerCase().includes(search.toLowerCase()) ||
        companyName.toLowerCase().includes(search.toLowerCase()) ||
        jobTitle.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesCompany = companyFilter ? item.company?._id === companyFilter : true;
      
      let matchesDate = true;
      if (dateFilter) {
        const itemDateStr = new Date(item.date).toISOString().split("T")[0];
        matchesDate = itemDateStr === dateFilter;
      }

      return matchesSearch && matchesStatus && matchesCompany && matchesDate;
    });
  }, [interviews, search, statusFilter, companyFilter, dateFilter]);

  // Paginated list
  const paginatedInterviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInterviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInterviews, currentPage]);

  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);

  // Open modal for schedule
  const handleOpenSchedule = () => {
    setEditingId(null);
    setSelectedStudent("");
    setSelectedJob("");
    setInterviewDate("");
    setInterviewTime("");
    setInterviewMode("Online");
    setMeetingLink("");
    setInterviewStatus("Scheduled");
    setError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item) => {
    setEditingId(item._id);
    setSelectedStudent(item.student?._id || "");
    setSelectedJob(item.job?._id || "");
    
    // Format date for date input (YYYY-MM-DD)
    const formattedDate = new Date(item.date).toISOString().split("T")[0];
    setInterviewDate(formattedDate);
    setInterviewTime(item.time || "");
    setInterviewMode(item.mode || "Online");
    setMeetingLink(item.meetingLink || "");
    setInterviewStatus(item.status || "Scheduled");
    setError(null);
    setIsModalOpen(true);
  };

  // Submit Schedule / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setMessage(null);

    const jobObj = jobs.find(j => j._id === selectedJob);
    if (!jobObj) {
      setError("Please select a valid job opening.");
      setActionLoading(false);
      return;
    }

    const payload = {
      student: selectedStudent,
      job: selectedJob,
      company: jobObj.company?._id || jobObj.company,
      date: new Date(interviewDate),
      time: interviewTime,
      mode: interviewMode,
      meetingLink: interviewMode === "Online" ? meetingLink : "",
      status: interviewStatus
    };

    try {
      if (editingId) {
        await apiService.interviews.update(editingId, payload);
        setMessage("Interview rescheduled successfully!");
      } else {
        await apiService.interviews.schedule(payload);
        setMessage("Interview scheduled successfully!");
      }
      setIsModalOpen(false);
      await loadData();
      await fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel Interview
  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this interview? This will send notification emails to the student.")) {
      return;
    }

    setActionLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiService.interviews.delete(id);
      setMessage("Interview cancelled successfully.");
      await loadData();
      await fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to cancel interview.");
    } finally {
      setActionLoading(false);
    }
  };

  // Unique companies list for filter dropdown
  const uniqueCompanies = useMemo(() => {
    const list = [];
    const ids = new Set();
    interviews.forEach(item => {
      if (item.company && !ids.has(item.company._id)) {
        ids.add(item.company._id);
        list.push(item.company);
      }
    });
    return list;
  }, [interviews]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Interview Planner</h2>
          <p className="text-xs text-slate-400 mt-1">Schedule, reschedule, and track student recruitment rounds</p>
        </div>
        <button
          onClick={handleOpenSchedule}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold px-4 py-3 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Schedule Interview
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="p-4 rounded-xl border border-green-500/25 bg-green-500/10 text-green-400 text-xs font-semibold">
          {message}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            placeholder="Search by student, company, or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-900/40 border border-slate-850 px-4 py-2.5 pl-10 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all placeholder-slate-500"
          />
          <svg className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Company Filter */}
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="rounded-xl bg-slate-900/40 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="">All Companies</option>
          {uniqueCompanies.map(c => (
            <option key={c._id} value={c._id}>{c.companyName}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl bg-slate-900/40 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-xl bg-slate-900/40 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* Listing Grid / Table */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : filteredInterviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-12 text-center max-w-xl mx-auto">
          <p className="text-sm font-bold text-slate-400">No interviews match current filters.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting dates or searching other keywords.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 overflow-hidden shadow-xl">
          {/* Table View (Desktop/Tablet) */}
          <div className="hidden md:block overflow-x-auto max-h-[600px] scrollbar-thin">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky-header border-b border-slate-900 bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Company & Role</th>
                  <th className="p-4">Schedule Details</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {paginatedInterviews.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/10 transition-all">
                    <td className="p-4 font-semibold text-slate-100">
                      <div>
                        <p>{item.student?.name || "Student Deleted"}</p>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                          {item.student?.branch} • CGPA: {item.student?.cgpa}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{item.job?.title || "Role"}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.company?.companyName}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p>{new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.time}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-3xs font-semibold ${
                        item.mode === "Online" ? "bg-indigo-500/10 text-indigo-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {item.mode}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-3xs font-semibold ${
                        item.status === "Cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/15" :
                        item.status === "Completed" ? "bg-green-500/10 text-green-400 border border-green-500/15" :
                        "bg-blue-500/10 text-blue-400 border border-blue-500/15"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-bold px-2.5 py-1.5 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-slate-300"
                      >
                        Reschedule
                      </button>
                      {item.status !== "Cancelled" && (
                        <button
                          onClick={() => handleCancel(item._id)}
                          className="rounded-lg bg-red-950/20 hover:bg-red-950/40 text-[10px] font-bold px-2.5 py-1.5 border border-red-900/20 hover:border-red-900/40 transition-all cursor-pointer text-red-400"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards View (Mobile) */}
          <div className="md:hidden divide-y divide-slate-900 text-xs text-slate-300">
            {paginatedInterviews.map((item) => (
              <div key={item._id} className="p-4 space-y-3 hover:bg-slate-900/5 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{item.student?.name || "Student Deleted"}</h4>
                    <p className="text-3xs text-slate-500 mt-0.5">{item.student?.branch} • CGPA: {item.student?.cgpa}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-3xs font-semibold shrink-0 ${
                    item.status === "Cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/15" :
                    item.status === "Completed" ? "bg-green-500/10 text-green-400 border border-green-500/15" :
                    "bg-blue-500/10 text-blue-400 border border-blue-500/15"
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="text-2xs text-slate-350 space-y-1 bg-slate-950/25 p-3 rounded-xl border border-slate-900/60">
                  <p><span className="text-slate-500">Position:</span> <span className="text-slate-200 font-semibold">{item.job?.title || "Role"}</span></p>
                  <p><span className="text-slate-500">Employer:</span> <span className="text-slate-200">{item.company?.companyName}</span></p>
                  <p><span className="text-slate-500">Date/Time:</span> <span className="text-slate-200">{new Date(item.date).toLocaleDateString()} • {item.time}</span></p>
                  <p>
                    <span className="text-slate-500">Mode: </span>
                    <span className={`font-semibold ${item.mode === "Online" ? "text-indigo-400" : "text-amber-400"}`}>{item.mode}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex-1 select-none text-center rounded-xl bg-slate-900 hover:bg-slate-850 text-[10px] font-bold py-2.5 border border-slate-800 transition-all text-slate-300 min-h-[44px] cursor-pointer"
                  >
                    Reschedule
                  </button>
                  {item.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancel(item._id)}
                      className="flex-1 select-none text-center rounded-xl bg-red-950/20 hover:bg-red-950/40 text-[10px] font-bold py-2.5 border border-red-900/20 transition-all text-red-400 min-h-[44px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-900 bg-slate-900/20 p-4 text-xs font-semibold text-slate-400">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="rounded-lg border border-slate-850 px-3 py-1.5 hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="rounded-lg border border-slate-850 px-3 py-1.5 hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scheduling / Reschedule Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl relative overflow-hidden animate-fadeIn"
          >
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
              {editingId ? "Reschedule Placement Interview" : "Schedule New Screening Round"}
            </h3>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student */}
              <div className="sm:col-span-2">
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Select Candidate</label>
                <select
                  required
                  value={selectedStudent}
                  disabled={!!editingId}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Select Student Profile</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.branch} • CGPA: {s.cgpa})</option>
                  ))}
                </select>
              </div>

              {/* Job */}
              <div className="sm:col-span-2">
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Job Drive</label>
                <select
                  required
                  value={selectedJob}
                  disabled={!!editingId}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Select active job opening</option>
                  {jobs.map(j => (
                    <option key={j._id} value={j._id}>{j.title} • {j.company?.companyName || "Company"}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time (e.g. 14:30)</label>
                <input
                  type="text"
                  required
                  placeholder="10:00 AM"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Mode */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mode</label>
                <select
                  required
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Online">Online Meeting</option>
                  <option value="Offline">Offline Drive</option>
                </select>
              </div>

              {/* Status (Visible only when editing) */}
              {editingId && (
                <div>
                  <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <select
                    required
                    value={interviewStatus}
                    onChange={(e) => setInterviewStatus(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              {/* Link (Required if Online) */}
              {interviewMode === "Online" && (
                <div className="sm:col-span-2">
                  <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meeting Link</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    required
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-850 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-950 transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading ? <LoadingSpinner size="sm" color="text-white" /> : (editingId ? "Apply Changes" : "Create Schedule")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
