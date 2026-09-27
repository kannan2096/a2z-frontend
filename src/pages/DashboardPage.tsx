import React, { useEffect, useState } from "react";
import { colors } from "@/theme/colors";
import { apiClient } from "@/api/client";

type Summary = {
  ordersToday: number;
  revenueTodayCents: number;
  lowStockItems: number;
  openSupportChats: number | null;
};

export function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<Summary>("/api/v1/admin/reports/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setError("Couldn't load dashboard metrics."));
  }, []);

  const stats = summary
    ? [
        { label: "Orders today", value: String(summary.ordersToday) },
        { label: "Revenue today", value: `S$${(summary.revenueTodayCents / 100).toFixed(2)}` },
        { label: "Low stock items", value: String(summary.lowStockItems) },
        { label: "Open support chats", value: summary.openSupportChats == null ? "—" : String(summary.openSupportChats) },
      ]
    : [];

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>Dashboard</h1>

      {error && <p style={{ fontSize: 12, color: colors.danger, marginTop: 12 }}>{error}</p>}
      {!summary && !error && <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>Loading…</p>}

      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: colors.pastelPurple, borderRadius: 10, padding: 14 }}>
              <p style={{ fontSize: 12, color: colors.textOnPurple, margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 600, color: colors.textOnPurple, margin: "6px 0 0" }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 20 }}>
        "Open support chats" is always shown as — for now: there's no chat backend built yet (mobile app's Chat tab has no server support).
      </p>
    </div>
  );
}
