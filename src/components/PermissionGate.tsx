import React from "react";
import { useAuth } from "@/auth/AuthContext";
import type { Permission } from "@/types/rbac";

// Hides children the current staff member can't act on. UX convenience only —
// the backend @PreAuthorize check is the real gate (architecture doc 6.4).
export function PermissionGate({ need, children }: { need: Permission; children: React.ReactNode }) {
  const { hasPermission } = useAuth();
  if (!hasPermission(need)) return null;
  return <>{children}</>;
}
