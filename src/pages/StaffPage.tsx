import React from "react";
import { colors } from "@/theme/colors";

// Route itself is only reachable by staff with STAFF_MANAGE (see routes/AppRoutes.tsx),
// i.e. Super Admin only, per the permission matrix in the architecture doc.
export function StaffPage() {
  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>Staff & roles</h1>
      <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>
        Manage staff accounts and their roles here (Super Admin only). Every change writes to
        audit_log per architecture doc section 6.4.
      </p>
    </div>
  );
}
