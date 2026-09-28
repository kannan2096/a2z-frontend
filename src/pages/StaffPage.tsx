import React from "react";
import { colors } from "@/theme/colors";
import { card, h1, pageHeader } from "@/theme/ui";

// Route itself is only reachable by staff with STAFF_MANAGE (see routes/AppRoutes.tsx),
// i.e. Super Admin only, per the permission matrix in the architecture doc.
export function StaffPage() {
  return (
    <div>
      <div style={pageHeader}>
        <div>
          <h1 style={h1}>Staff & roles</h1>
          <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Super Admin only.</p>
        </div>
      </div>
      <div style={{ ...card, padding: 20 }}>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0, lineHeight: 1.6 }}>
          Manage staff accounts and their roles here. Every change writes to <code>audit_log</code> per architecture doc section 6.4. Not built yet — this page is next in line after Catalogue/Orders/Dashboard.
        </p>
      </div>
    </div>
  );
}
