"use client";

import ProtectedRoute from "./ProtectedRoute";

export default function StudentGuard({ children }) {
  return <ProtectedRoute allowedRoles={["student"]}>{children}</ProtectedRoute>;
}
