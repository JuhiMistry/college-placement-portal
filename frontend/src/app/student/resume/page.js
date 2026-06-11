"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function StudentResume() {
  const { user, updateUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const data = await apiService.resume.upload(file);
      setSuccessMsg("Resume uploaded successfully!");
      
      // Update context user state
      updateUser({
        ...user,
        resumeUrl: data.resume,
      });
      setFile(null);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to upload resume.");
      setTimeout(() => setErrorMsg(""), 4500);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl font-bold text-slate-100">Resume Portfolio</h2>
        <p className="text-xs text-slate-400 mt-1">Upload and manage your professional curriculum vitae (PDF)</p>
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

      {/* CV Status Card */}
      <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-2">Resume Status</h3>
          {user?.resumeUrl ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-850">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-300">Curriculum Vitae (PDF)</p>
                  <a
                    href={`${API_BASE_URL.replace("/api", "")}/uploads/${user.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xs font-bold text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    View Uploaded Document
                  </a>
                </div>
              </div>
              <span className="text-3xs font-semibold text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 uppercase">
                Active
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center">
              <p className="text-xs text-slate-500">No resume file uploaded yet. Submit a PDF below to apply to jobs.</p>
            </div>
          )}
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4 border-t border-slate-900/60 pt-5">
          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">Select Resume File</label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={handleFileChange}
              className="mt-2 w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-slate-200 hover:file:bg-slate-850 cursor-pointer file:cursor-pointer"
            />
            <p className="text-3xs text-slate-500 mt-2">Only PDF formats are supported. Max file size 5MB.</p>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full select-none rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 transition-all outline-none disabled:opacity-40 disabled:pointer-events-none"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading Resume...
              </span>
            ) : (
              "Submit Resume"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
