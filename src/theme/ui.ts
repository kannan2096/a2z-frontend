import React from "react";
import { colors } from "@/theme/colors";

// Shared style fragments so pages stop hand-rolling slightly-different
// buttons/cards/tables — this is what was making the console feel
// unpolished (inconsistent radii, shadows, spacing from page to page).
export const shadow = {
  sm: "0 1px 2px rgba(20, 20, 15, 0.06)",
  md: "0 4px 16px rgba(20, 20, 15, 0.08)",
  lg: "0 12px 32px rgba(20, 20, 15, 0.12)",
};

export const radius = { sm: 8, md: 12, lg: 20 };

export const card: React.CSSProperties = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  boxShadow: shadow.sm,
};

export const pageHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

export const h1: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: colors.textPrimary,
  letterSpacing: "-0.01em",
};

function buttonBase(bg: string, fg: string): React.CSSProperties {
  return {
    background: bg,
    color: fg,
    border: "none",
    borderRadius: radius.sm,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: shadow.sm,
    transition: "transform 0.08s ease, box-shadow 0.15s ease, opacity 0.15s ease",
  };
}

export const button = {
  primary: buttonBase("#378ADD", "#fff"),
  accent: buttonBase("#D4537E", "#fff"),
  ghost: {
    background: "transparent",
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.sm,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
  danger: {
    background: "transparent",
    color: colors.danger,
    border: `1px solid #EAC7C7`,
    borderRadius: radius.sm,
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
};

export const input: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: radius.sm,
  border: `1px solid ${colors.border}`,
  fontSize: 13,
  background: "#FCFCFA",
  transition: "border-color 0.15s ease",
};

export const table = {
  wrap: { ...card, overflow: "hidden", marginTop: 16 } as React.CSSProperties,
  el: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
  theadRow: {
    textAlign: "left" as const,
    color: colors.textMuted,
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    background: "#FAFAF7",
  },
  th: { padding: "12px 16px", fontWeight: 600 },
  td: { padding: "13px 16px", borderTop: `1px solid ${colors.border}` },
  rowHover: {
    transition: "background 0.1s ease",
  } as React.CSSProperties,
};

export const badge = (bg: string, fg: string = colors.textPrimary): React.CSSProperties => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  background: bg,
  color: fg,
});
