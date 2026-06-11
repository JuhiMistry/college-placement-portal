"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-slate-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
