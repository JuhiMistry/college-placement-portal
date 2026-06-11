"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    cgpa: "",
    github: "",
    linkedin: "",
    skillsInput: "",
    projectsInput: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiService.profile.get();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          branch: data.branch || "",
          cgpa: data.cgpa || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          skillsInput: data.skills ? data.skills.join(", ") : "",
          projectsInput: data.projects ? data.projects.join(", ") : "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    const skills = formData.skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const projects = formData.projectsInput
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "");

    const payload = {
      name: formData.name,
      email: formData.email,
      branch: formData.branch,
      cgpa: parseFloat(formData.cgpa) || 0,
      github: formData.github,
      linkedin: formData.linkedin,
      skills,
      projects,
    };

    try {
      const updated = await apiService.profile.update(payload);
      updateUser(updated); // Sync auth state
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to update profile.");
      setTimeout(() => setErrorMsg(""), 4500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl font-bold text-slate-100">Student Profile</h2>
        <p className="text-xs text-slate-400 mt-1">Configure your personal, academic, and portfolio details</p>
      </div>

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

      <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500 focus:bg-slate-950/70"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500 focus:bg-slate-950/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Branch / Major</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. Information Technology"
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500 focus:bg-slate-950/70"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.75"
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500 focus:bg-slate-950/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-900/60 pt-4">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">GitHub Link</label>
              <input
                type="url"
                name="github"
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500 focus:bg-slate-950/70"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">LinkedIn Link</label>
              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500 focus:bg-slate-950/70"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-900/60 pt-4">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Skills (comma separated)</label>
              <input
                type="text"
                name="skillsInput"
                placeholder="React, Next.js, Node.js, Python"
                value={formData.skillsInput}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500 focus:bg-slate-950/70"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Projects (comma separated)</label>
              <input
                type="text"
                name="projectsInput"
                placeholder="E-commerce App, Student Placement Portal"
                value={formData.projectsInput}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950/40 py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500 focus:bg-slate-950/70"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full select-none rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 transition-all outline-none disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
