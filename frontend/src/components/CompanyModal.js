"use client";

import { useEffect, useState } from "react";

export default function CompanyModal({ isOpen, company, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    package: "",
    location: "",
    eligibilityCGPA: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        description: company.description || "",
        package: company.package || "",
        location: company.location || "",
        eligibilityCGPA: company.eligibilityCGPA || "",
        deadline: company.deadline ? company.deadline.split("T")[0] : "",
      });
    } else {
      setFormData({
        companyName: "",
        description: "",
        package: "",
        location: "",
        eligibilityCGPA: "",
        deadline: "",
      });
    }
  }, [company, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        eligibilityCGPA: parseFloat(formData.eligibilityCGPA) || 0,
      };
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-scaleUp text-slate-200">
        <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 mb-5">
          {company ? "Edit Company" : "Register Company"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Company Name</label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Google Inc"
              className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Technology and Internet services..."
              className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Salary Package</label>
              <input
                type="text"
                name="package"
                required
                value={formData.package}
                onChange={handleChange}
                placeholder="e.g. 14 LPA"
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Location</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="eligibilityCGPA"
                required
                value={formData.eligibilityCGPA}
                onChange={handleChange}
                placeholder="e.g. 7.5"
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-300 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 select-none rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs py-3 min-h-[44px] flex items-center justify-center transition-all outline-none disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 select-none rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-3 min-h-[44px] flex items-center justify-center transition-all outline-none disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : company ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
