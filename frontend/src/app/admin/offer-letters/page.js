"use client";

import { useEffect, useState, useMemo } from "react";
import { apiService } from "@/lib/api";
import { useNotifications } from "@/context/NotificationContext";
import SkeletonTable from "@/components/SkeletonTable";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminOfferLetters() {
  const { fetchNotifications } = useNotifications();

  const [offers, setOffers] = useState([]);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [salary, setSalary] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [offerFile, setOfferFile] = useState(null);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [offerList, studList, jobList] = await Promise.all([
        apiService.offerLetters.getAll(),
        apiService.admin.getStudents(),
        apiService.jobs.getAll()
      ]);
      setOffers(offerList);
      setStudents(studList);
      setJobs(jobList);
    } catch (err) {
      console.error("Failed to load offer letter database:", err);
      setError("Failed to retrieve offer letter registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered List
  const filteredOffers = useMemo(() => {
    return offers.filter((item) => {
      const studentName = item.student?.name || "";
      const companyName = item.company?.companyName || "";
      const jobTitle = item.job?.title || "";

      const matchesSearch =
        studentName.toLowerCase().includes(search.toLowerCase()) ||
        companyName.toLowerCase().includes(search.toLowerCase()) ||
        jobTitle.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesCompany = companyFilter ? item.company?._id === companyFilter : true;

      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [offers, search, statusFilter, companyFilter]);

  // Paginated List
  const paginatedOffers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOffers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOffers, currentPage]);

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  const handleOpenUpload = () => {
    setSelectedStudent("");
    setSelectedJob("");
    setSalary("");
    setJoiningDate("");
    setOfferFile(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Only PDF files are supported for offer letters.");
        setOfferFile(null);
        return;
      }
      setOfferFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setMessage(null);

    if (!offerFile) {
      setError("Offer letter PDF file is required.");
      setActionLoading(false);
      return;
    }

    const jobObj = jobs.find(j => j._id === selectedJob);
    if (!jobObj) {
      setError("Selected job is invalid.");
      setActionLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("student", selectedStudent);
    formData.append("job", selectedJob);
    formData.append("company", jobObj.company?._id || jobObj.company);
    formData.append("salary", salary);
    formData.append("joiningDate", joiningDate);
    formData.append("offerLetter", offerFile);

    try {
      await apiService.offerLetters.upload(formData);
      setMessage("Offer letter uploaded and student notified!");
      setIsModalOpen(false);
      await loadData();
      await fetchNotifications(); // Notify student / admin
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "File upload failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!confirm("Are you sure you want to revoke/delete this offer letter?")) {
      return;
    }

    setActionLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiService.offerLetters.delete(id);
      setMessage("Offer letter revoked successfully.");
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Failed to revoke offer letter.");
    } finally {
      setActionLoading(false);
    }
  };

  const uniqueCompanies = useMemo(() => {
    const list = [];
    const ids = new Set();
    offers.forEach(item => {
      if (item.company && !ids.has(item.company._id)) {
        ids.add(item.company._id);
        list.push(item.company);
      }
    });
    return list;
  }, [offers]);

  const getFullPdfUrl = (url) => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "") : " ";
    return `${backendUrl}${url}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Offer Letter Manager</h2>
          <p className="text-xs text-slate-400 mt-1">Issue, review, and manage formal placements offers for candidates</p>
        </div>
        <button
          onClick={handleOpenUpload}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold px-4 py-3 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Offer Letter
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

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl bg-slate-900/40 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Grid List */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : filteredOffers.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-12 text-center max-w-xl mx-auto">
          <p className="text-sm font-bold text-slate-400">No offer letters match selected filters.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-slate-900 bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Company & Role</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {paginatedOffers.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/10 transition-all">
                    <td className="p-4 font-semibold text-slate-100">
                      <div>
                        <p>{item.student?.name || "Student Profile"}</p>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">{item.student?.branch}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{item.job?.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.company?.companyName}</p>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-blue-400">{item.salary} LPA</td>
                    <td className="p-4">{new Date(item.joiningDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-3xs font-semibold ${
                        item.status === "Accepted" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        item.status === "Rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <a
                        href={getFullPdfUrl(item.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-bold px-2.5 py-1.5 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer inline-block text-slate-300"
                      >
                        View PDF
                      </a>
                      <button
                        onClick={() => handleRevoke(item._id)}
                        disabled={actionLoading}
                        className="rounded-lg bg-red-950/20 hover:bg-red-950/40 text-[10px] font-bold px-2.5 py-1.5 border border-red-900/20 hover:border-red-900/40 transition-all cursor-pointer text-red-400"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl relative animate-fadeIn"
          >
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">Upload Student Offer Letter</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student */}
              <div className="sm:col-span-2">
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Candidate</label>
                <select
                  required
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Student</option>
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
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Job Position</option>
                  {jobs.map(j => (
                    <option key={j._id} value={j._id}>{j.title} • {j.company?.companyName}</option>
                  ))}
                </select>
              </div>

              {/* Salary (CTC) */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Salary Package (LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 12.5"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Joining Date</label>
                <input
                  type="date"
                  required
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* PDF File Drop-zone */}
              <div className="sm:col-span-2">
                <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Offer Letter PDF File</label>
                <div className="mt-1 flex justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/20 px-6 py-6 transition-all hover:border-slate-700">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-8 w-8 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-xs text-slate-400 justify-center">
                      <label className="relative cursor-pointer rounded-md font-semibold text-blue-400 hover:text-blue-300 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-[10px] text-slate-500">PDF up to 10MB</p>
                    {offerFile && (
                      <p className="text-2xs text-emerald-400 font-semibold mt-2">Selected: {offerFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
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
                {actionLoading ? <LoadingSpinner size="sm" color="text-white" /> : "Upload offer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
