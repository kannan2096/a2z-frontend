import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import type { Permission } from "@/types/rbac";

// Route-level guard: redirects to /login if unauthenticated, and to / if the
// staff member lacks the required permission for this section. Backed up by
// the backend's @PreAuthorize on every underlying API call — this is UX only.
export function ProtectedRoute({ need, children }: { need?: Permission; children: React.ReactNode }) {
  const { profile, loading, hasPermission } = useAuth();

  if (loading) return null;
  if (!profile) return <Navigate to="/login" replace />;
  if (need && !hasPermission(need)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
