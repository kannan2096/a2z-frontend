import React, { useEffect, useState } from "react";
import { colors } from "@/theme/colors";
import { apiClient } from "@/api/client";
import { card, h1, pageHeader, shadow } from "@/theme/ui";

type Summary = {
  ordersToday: number;
  revenueTodayCents: number;
  lowStockItems: number;
  openSupportChats: number | null;
};

const TILE_THEMES = [
  { bg: colors.pastelBlue, fg: colors.textOnBlue },
  { bg: colors.pastelPurple, fg: colors.textOnPurple },
  { bg: colors.pastelPink, fg: colors.textOnPink },
  { bg: "#EAF3E3", fg: colors.success },
];

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
      <div style={pageHeader}>
        <div>
          <h1 style={h1}>Dashboard</h1>
          <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>A quick snapshot of today at A2Z Mochi Paradise.</p>
        </div>
      </div>

      {error && (
        <div style={{ ...card, padding: 16, borderColor: "#EAC7C7" }}>
          <p style={{ fontSize: 13, color: colors.danger, margin: 0 }}>{error}</p>
        </div>
      )}

      {!summary && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ ...card, height: 92, background: "#F1F1EE" }} />
          ))}
        </div>
      )}

      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                background: TILE_THEMES[i].bg,
                borderRadius: 14,
                padding: "18px 18px 16px",
                boxShadow: shadow.sm,
              }}
            >
              <p style={{ fontSize: 12, color: TILE_THEMES[i].fg, margin: 0, fontWeight: 600, opacity: 0.85 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: TILE_THEMES[i].fg, margin: "8px 0 0", letterSpacing: "-0.02em" }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...card, padding: "14px 18px", marginTop: 20 }}>
        <p style={{ fontSize: 12, color: colors.textMuted, margin: 0 }}>
          "Open support chats" is always shown as — for now: there's no chat backend built yet (the mobile app's Chat tab has no server support).
        </p>
      </div>
    </div>
  );
}
