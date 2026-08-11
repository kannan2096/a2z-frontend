import React from "react";
import { NavLink } from "react-router-dom";
import { colors } from "@/theme/colors";
import { CapybaraMark } from "@/components/CapybaraMark";
import { useAuth } from "@/auth/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", need: null },
  { to: "/catalogue", label: "Catalogue", need: "CATALOGUE_WRITE" as const },
  { to: "/orders", label: "Orders", need: "ORDER_VIEW" as const },
  { to: "/staff", label: "Staff & roles", need: "STAFF_MANAGE" as const },
] as const;

export function Sidebar() {
  const { profile, hasPermission, logout } = useAuth();

  return (
    <aside style={{ width: 220, background: colors.surface, borderRight: `0.5px solid ${colors.border}`, padding: 16, display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <CapybaraMark size={26} />
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.textOnPurple }}>Mochi Admin</span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {NAV_ITEMS.filter((i) => i.need === null || hasPermission(i.need)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              padding: "8px 10px",
              borderRadius: 8,
              fontSize: 13,
              textDecoration: "none",
              color: isActive ? colors.textOnPurple : colors.textSecondary,
              background: isActive ? colors.pastelPurple : "transparent",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: `0.5px solid ${colors.border}`, paddingTop: 12 }}>
        <p style={{ fontSize: 11, color: colors.textMuted, margin: 0 }}>{profile?.email}</p>
        <p style={{ fontSize: 11, color: colors.textMuted, margin: "2px 0 8px" }}>{profile?.role}</p>
        <button onClick={logout} style={{ fontSize: 12, border: `0.5px solid ${colors.border}`, background: "transparent", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
          Log out
        </button>
      </div>
    </aside>
  );
}
