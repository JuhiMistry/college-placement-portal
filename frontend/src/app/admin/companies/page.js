"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import CompanyModal from "@/components/CompanyModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadCompanies = async () => {
    try {
      const data = await apiService.companies.getAll();
      setCompanies(data);
    } catch (err) {
      console.error("Failed to load companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (company) => {
    setCompanyToDelete(company);
    setIsDeleteOpen(true);
  };

  const handleCompanySubmit = async (payload) => {
    if (editingCompany) {
      // Update
      const updated = await apiService.companies.update(editingCompany._id, payload);
      setCompanies((prev) =>
        prev.map((c) => (c._id === editingCompany._id ? updated : c))
      );
    } else {
      // Create
      const created = await apiService.companies.create(payload);
      setCompanies((prev) => [created, ...prev]);
    }
    loadCompanies(); // Re-fetch to ensure sync
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    try {
      await apiService.companies.delete(companyToDelete._id);
      setCompanies((prev) => prev.filter((c) => c._id !== companyToDelete._id));
      setIsDeleteOpen(false);
      setCompanyToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Search & Filter Logic
  const filteredCompanies = companies.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.companyName?.toLowerCase().includes(term) ||
      c.location?.toLowerCase().includes(term)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Company Recruiters</h2>
          <p className="text-xs text-slate-400 mt-1">Register and manage corporate recruitment accounts</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="select-none rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/10"
        >
          Add Company
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
          placeholder="Search by company name or location..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
          className="w-full rounded-xl border border-slate-850 bg-slate-900/20 py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none transition-all focus:border-blue-500 focus:bg-slate-900/40"
        />
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 py-16 text-center">
          <p className="text-slate-500 text-xs">No companies matching search criteria.</p>
        </div>
      ) : (
        <>
          {/* Companies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((comp) => (
              <div 
                key={comp._id} 
                className="rounded-2xl border border-slate-850 bg-slate-900/20 p-5 flex flex-col justify-between hover:border-slate-800 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-blue-400 transition-all truncate">
                      {comp.companyName}
                    </h3>
                    <span className="text-3xs font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 uppercase shrink-0">
                      {comp.package}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-5">
                    {comp.description}
                  </p>
                </div>

                <div className="border-t border-slate-900/60 pt-4 mt-auto flex flex-col gap-3">
                  <div className="flex items-center justify-between text-3xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1 truncate">
                      <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{comp.location}</span>
                    </span>
                    <span className="shrink-0">CGPA: <strong className="text-slate-400">{comp.eligibilityCGPA}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(comp)}
                      className="flex-1 select-none rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-750 hover:bg-slate-850 text-slate-300 text-3xs font-semibold py-2.5 px-3.5 transition-all outline-none active:scale-[0.98] cursor-pointer min-h-[44px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDelete(comp)}
                      className="flex-1 select-none rounded-xl bg-slate-950 border border-red-950/40 hover:border-red-900/80 hover:text-red-400 text-slate-400 text-3xs font-semibold py-2.5 px-3.5 transition-all outline-none active:scale-[0.98] cursor-pointer min-h-[44px]"
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
      <CompanyModal
        isOpen={isModalOpen}
        company={editingCompany}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCompanySubmit}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        title="Delete Recruiter Account"
        message={`Are you sure you want to delete "${companyToDelete?.companyName}"? All associated job postings and student application histories will be permanently removed.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
