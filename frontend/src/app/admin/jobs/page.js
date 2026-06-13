"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import JobModal from "@/components/JobModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadData = async () => {
    try {
      const jobsData = await apiService.jobs.getAll();
      setJobs(jobsData);
      const compsData = await apiService.companies.getAll();
      setCompanies(compsData);
    } catch (err) {
      console.error("Failed to load jobs/companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    if (companies.length === 0) {
      alert("Please register at least one company before creating job postings.");
      return;
    }
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (job) => {
    setJobToDelete(job);
    setIsDeleteOpen(true);
  };

  const handleJobSubmit = async (payload) => {
    if (editingJob) {
      // Update
      const updated = await apiService.jobs.update(editingJob._id, payload);
      setJobs((prev) =>
        prev.map((j) => (j._id === editingJob._id ? updated : j))
      );
    } else {
      // Create
      const created = await apiService.jobs.create(payload);
      setJobs((prev) => [created, ...prev]);
    }
    loadData(); // Sync with populates
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      await apiService.jobs.delete(jobToDelete._id);
      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      setIsDeleteOpen(false);
      setJobToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Search & Filter Logic
  const filteredJobs = jobs.filter((j) => {
    const term = searchTerm.toLowerCase();
    const companyName = j.company?.companyName?.toLowerCase() || "";
    return (
      j.title?.toLowerCase().includes(term) ||
      j.location?.toLowerCase().includes(term) ||
      companyName.includes(term)
    );
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Job Opportunities</h2>
          <p className="text-xs text-slate-400 mt-1">Publish and manage recruitment job postings</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="select-none rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/10"
        >
          Post New Job
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by job title, company name, or location..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-xl border border-slate-850 bg-slate-900/20 py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none transition-all focus:border-blue-500 focus:bg-slate-900/40"
        />
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 py-16 text-center">
          <p className="text-slate-500 text-xs">No job vacancies found matching search criteria.</p>
        </div>
      ) : (
        <>
          {/* Jobs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((job) => (
              <div 
                key={job._id} 
                className="rounded-2xl border border-slate-850 bg-slate-900/20 p-5 flex flex-col justify-between hover:border-slate-800 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-3xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase shrink-0">
                        {job.company?.companyName || "Company"}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-blue-400 transition-all mt-2 truncate max-w-[150px] sm:max-w-none">
                        {job.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-emerald-400">{job.package}</p>
                      <p className="text-3xs text-slate-500 mt-0.5">{job.location}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-5">
                    {job.description}
                  </p>

                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Required Core Skills</h4>
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

                <div className="border-t border-slate-900/60 pt-4 mt-auto flex flex-col gap-3">
                  <div className="flex items-center justify-between text-3xs text-slate-500 font-semibold">
                    <span>
                      Min CGPA: <strong className="text-slate-400">{job.company?.eligibilityCGPA || "N/A"}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(job)}
                      className="flex-1 select-none rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-750 hover:bg-slate-850 text-slate-300 text-3xs font-semibold py-2.5 px-3.5 transition-all outline-none min-h-[44px] cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDelete(job)}
                      className="flex-1 select-none rounded-xl bg-slate-950 border border-red-950/40 hover:border-red-900/80 hover:text-red-400 text-slate-400 text-3xs font-semibold py-2.5 px-3.5 transition-all outline-none min-h-[44px] cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
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

      {/* Modals */}
      <JobModal
        isOpen={isModalOpen}
        job={editingJob}
        companies={companies}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleJobSubmit}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        title="Delete Job Posting"
        message={`Are you sure you want to delete this job posting "${jobToDelete?.title}"? All submitted student applications for this position will be permanently deleted.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
