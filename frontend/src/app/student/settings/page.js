"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { apiService } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StudentSettings() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile states
  const [name, setName] = useState(user?.name || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [cgpa, setCgpa] = useState(user?.cgpa || "");

  // Password states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preference states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);

  // Status states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const updatedUser = await apiService.profile.update({
        name,
        branch,
        cgpa: Number(cgpa),
      });
      updateUser(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await apiService.profile.update({ password });
      setMessage("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl font-bold text-slate-100">Account Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Manage your student profile, security, and interface preferences</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <form onSubmit={handleUpdateProfile} className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Update Profile</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="">Select Branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 text-xs font-bold tracking-wide text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer min-h-[44px]"
          >
            {loading ? <LoadingSpinner size="sm" color="text-white" /> : "Save Profile Changes"}
          </button>
        </form>

        {/* Password Card */}
        <form onSubmit={handleChangePassword} className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Change Password</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-950 border border-slate-850 px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 text-xs font-bold tracking-wide text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer min-h-[44px]"
          >
            {loading ? <LoadingSpinner size="sm" color="text-white" /> : "Update Password"}
          </button>
        </form>

        {/* Display Settings & Preferences */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-3">Preferences & Theme</h3>
          
          {/* Theme Selector */}
          <div className="space-y-3">
            <h4 className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Appearance</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                  theme === "dark"
                    ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark Theme
              </button>
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                  theme === "light"
                    ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Light Theme
              </button>
            </div>
          </div>

          {/* Preferences checkboxes */}
          <div className="space-y-3">
            <h4 className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Email Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="mt-0.5 rounded border-slate-850 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950 bg-slate-950"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-300">Daily Digest Emails</p>
                  <p className="text-3xs text-slate-500 mt-0.5">Receive summary updates about new job drives and schedules.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={interviewReminders}
                  onChange={(e) => setInterviewReminders(e.target.checked)}
                  className="mt-0.5 rounded border-slate-850 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950 bg-slate-950"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-300">Interview Reminders</p>
                  <p className="text-3xs text-slate-500 mt-0.5">Receive direct emails and dashboard alerts for upcoming schedules.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
