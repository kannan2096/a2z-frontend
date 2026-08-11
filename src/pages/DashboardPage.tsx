import React from "react";
import { colors } from "@/theme/colors";

export function DashboardPage() {
  const stats = [
    { label: "Orders today", value: "24" },
    { label: "Revenue today", value: "S$1,284" },
    { label: "Low stock items", value: "3" },
    { label: "Open support chats", value: "5" },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: colors.pastelPurple, borderRadius: 10, padding: 14 }}>
            <p style={{ fontSize: 12, color: colors.textOnPurple, margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 600, color: colors.textOnPurple, margin: "6px 0 0" }}>{s.value}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 20 }}>
        TODO: wire up to GET /api/v1/admin/reports/summary once the reporting endpoint exists.
      </p>
    </div>
  );
}
