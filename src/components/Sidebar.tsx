import React from "react";
import { NavLink } from "react-router-dom";
import { colors } from "@/theme/colors";
import { CapybaraMark } from "@/components/CapybaraMark";
import { NavIcon } from "@/components/NavIcon";
import { useAuth } from "@/auth/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", need: null, icon: "dashboard" as const },
  { to: "/catalogue", label: "Catalogue", need: "CATALOGUE_VIEW" as const, icon: "catalogue" as const },
  { to: "/orders", label: "Orders", need: "ORDER_VIEW" as const, icon: "orders" as const },
  { to: "/staff", label: "Staff & roles", need: "STAFF_MANAGE" as const, icon: "staff" as const },
] as const;

export function Sidebar() {
  const { profile, hasPermission, logout } = useAuth();
  const initials = (profile?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <aside
      style={{
        width: 236,
        background: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 28 }}>
        <div style={{ background: colors.pastelPurple, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CapybaraMark size={24} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.textOnPurple, lineHeight: 1.1 }}>Mochi Admin</div>
          <div style={{ fontSize: 10, color: colors.textMuted, letterSpacing: "0.03em", textTransform: "uppercase" }}>A2Z Paradise</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {NAV_ITEMS.filter((i) => i.need === null || hasPermission(i.need)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              textDecoration: "none",
              color: isActive ? colors.textOnPurple : colors.textSecondary,
              background: isActive ? colors.pastelPurple : "transparent",
              transition: "background 0.12s ease, color 0.12s ease",
            })}
          >
            <NavIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: colors.pastelPinkStrong,
            color: colors.textOnPink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11.5, color: colors.textPrimary, margin: 0, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.email}</p>
          <p style={{ fontSize: 10.5, color: colors.textMuted, margin: "1px 0 0" }}>{profile?.role}</p>
        </div>
        <button
          onClick={logout}
          title="Log out"
          style={{
            fontSize: 11,
            border: `1px solid ${colors.border}`,
            background: "transparent",
            borderRadius: 6,
            padding: "5px 9px",
            cursor: "pointer",
            color: colors.textSecondary,
            flexShrink: 0,
          }}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
