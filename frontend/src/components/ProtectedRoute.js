"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Access denied - redirect to respective dashboard
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
}
