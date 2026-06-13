"use client";

import { useEffect, useState } from "react";

export default function JobModal({ isOpen, job, companies = [], onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    package: "",
    location: "",
    skillsRequiredInput: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        company: job.company?._id || job.company || "",
        package: job.package || "",
        location: job.location || "",
        skillsRequiredInput: job.skillsRequired ? job.skillsRequired.join(", ") : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        company: companies[0]?._id || "",
        package: "",
        location: "",
        skillsRequiredInput: "",
      });
    }
  }, [job, companies, isOpen]);

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
      const skillsRequired = formData.skillsRequiredInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const payload = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        package: formData.package,
        location: formData.location,
        skillsRequired,
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
          {job ? "Edit Job Posting" : "Post Job Opportunity"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Recruiting Company</label>
            <select
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="" className="text-slate-500">Select Recruiter</option>
              {companies.map((comp) => (
                <option key={comp._id} value={comp._id} className="bg-slate-950 text-slate-300">
                  {comp.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Job Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Engineer"
              className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Job Description</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Build and optimize user interfaces..."
              className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Package</label>
              <input
                type="text"
                name="package"
                required
                value={formData.package}
                onChange={handleChange}
                placeholder="e.g. 18 LPA"
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
                placeholder="e.g. Remote / Pune"
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Required Skills (comma separated)</label>
            <input
              type="text"
              name="skillsRequiredInput"
              value={formData.skillsRequiredInput}
              onChange={handleChange}
              placeholder="e.g. React, Next.js, Node.js"
              className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
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
              {loading ? "Posting..." : job ? "Update" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
