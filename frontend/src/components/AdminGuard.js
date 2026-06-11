"use client";

import ProtectedRoute from "./ProtectedRoute";

export default function AdminGuard({ children }) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}
