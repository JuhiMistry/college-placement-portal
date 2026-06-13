"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/lib/api";

export default function Register() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    branch: "",
    cgpa: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState({ password: false, confirmPassword: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Too Weak", color: "bg-slate-700", percent: 0, checks: { minLength: false, uppercase: false, lowercase: false, number: false, special: false } };
    let score = 0;
    
    const hasMinLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    if (hasMinLength) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    let label = "Too Weak";
    let color = "bg-red-500/80";
    let percent = 20;

    if (score === 2) {
      label = "Weak";
      color = "bg-orange-500/80";
      percent = 40;
    } else if (score === 3) {
      label = "Medium";
      color = "bg-yellow-500/80";
      percent = 60;
    } else if (score === 4) {
      label = "Strong";
      color = "bg-green-500/80";
      percent = 80;
    } else if (score === 5) {
      label = "Very Strong";
      color = "bg-emerald-500/90";
      percent = 100;
    }

    return {
      score,
      label,
      color,
      percent,
      checks: {
        minLength: hasMinLength,
        uppercase: hasUppercase,
        lowercase: hasLowercase,
        number: hasNumber,
        special: hasSpecial
      }
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTouchedFields({ password: true, confirmPassword: true });

    const strength = getPasswordStrength(formData.password);
    if (strength.score < 3) {
      setError("Please choose a stronger password (at least Medium strength).");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "student") {
      if (formData.branch) payload.branch = formData.branch;
      if (formData.cgpa) payload.cgpa = parseFloat(formData.cgpa);
    }

    try {
      await apiService.auth.register(payload);
      setSuccess("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50/20 dark:from-slate-950 dark:to-slate-950 p-4 font-sans text-slate-800 dark:text-slate-200 relative overflow-hidden">
      {/* Floating abstract blurred shape elements */}
      <div className="absolute top-[10%] left-[10%] h-[300px] w-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] h-[300px] w-[300px] rounded-full bg-violet-500/5 dark:bg-violet-500/3 blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.02),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04),transparent_60%)]" />

      {/* Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="rounded-xl bg-white/80 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all active:scale-[0.98] outline-none shadow-sm min-h-[44px] inline-flex items-center justify-center gap-2"
        >
          <svg className="h-4.5 w-4.5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11V9a2 2 0 00-2-2M9 21V12h6v9m-6 0h6" />
          </svg>
          <span>Home</span>
        </Link>
      </div>

      {/* Elevated Form Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-850 bg-white/90 dark:bg-slate-900/40 p-8 shadow-xl dark:shadow-2xl backdrop-blur-xl animate-fadeIn">
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-500/10 dark:border-indigo-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create Account</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Join the College Placement Portal</p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 p-3.5 text-xs text-red-505 dark:text-red-400">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 dark:bg-green-500/10 p-3.5 text-xs text-green-505 dark:text-green-400">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 py-2.5 px-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950/70 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>

            <div>
              <label className="block text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 py-2.5 px-4 text-xs text-slate-800 dark:text-slate-200 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950/70 focus:ring-2 focus:ring-indigo-500/15"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 py-2.5 px-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950/70 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>

          <div>
            <label className="block text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  if (!touchedFields.password) {
                    setTouchedFields(prev => ({ ...prev, password: true }));
                  }
                }}
                onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 py-2.5 pl-4 pr-12 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950/70 focus:ring-2 focus:ring-indigo-500/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 focus:text-indigo-500 outline-none transition-all"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Strength scale */}
            {(touchedFields.password || formData.password.length > 0) && (
              <div className="mt-3 space-y-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 p-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-medium">Strength:</span>
                  <span className={`font-semibold tracking-wide ${
                    getPasswordStrength(formData.password).score <= 2 ? "text-red-500" :
                    getPasswordStrength(formData.password).score === 3 ? "text-yellow-500" : "text-green-500"
                  }`}>
                    {getPasswordStrength(formData.password).label}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-950/80 overflow-hidden">
                  <div
                    className={`h-full ${getPasswordStrength(formData.password).color} transition-all duration-500`}
                    style={{ width: `${getPasswordStrength(formData.password).percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Confirm Password</label>
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleChange(e);
                  if (!touchedFields.confirmPassword) {
                    setTouchedFields(prev => ({ ...prev, confirmPassword: true }));
                  }
                }}
                onBlur={() => setTouchedFields(prev => ({ ...prev, confirmPassword: true }))}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 py-2.5 pl-4 pr-12 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950/70 focus:ring-2 focus:ring-indigo-500/15"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 focus:text-indigo-500 outline-none transition-all"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {formData.role === "student" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800/60 pt-4 animate-fadeIn">
              <div>
                <label className="block text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Branch / Major</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 py-2.5 px-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950/70 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="8.50"
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 py-2.5 px-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950/70 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 py-3.5 text-xs font-bold tracking-wide text-white transition-all shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-all">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
