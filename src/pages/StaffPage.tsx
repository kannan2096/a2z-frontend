import React, { useEffect, useState } from "react";
import { colors } from "@/theme/colors";
import { badge, button, card, h1, input, pageHeader, table } from "@/theme/ui";
import { apiClient } from "@/api/client";
import { useAuth } from "@/auth/AuthContext";

type StaffRow = {
  id: number;
  email: string;
  role: string;
  mfaEnabled: boolean;
  status: "ACTIVE" | "SUSPENDED";
};

// Route itself is only reachable by staff with STAFF_MANAGE (see routes/AppRoutes.tsx),
// i.e. Super Admin only, per the permission matrix in the architecture doc.
export function StaffPage() {
  const { profile } = useAuth();
  const [staff, setStaff] = useState<StaffRow[] | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState<{ email: string; temporaryPassword: string } | null>(null);

  function load() {
    setError(null);
    apiClient
      .get<StaffRow[]>("/api/v1/admin/staff")
      .then((res) => setStaff(res.data))
      .catch(() => setError("Couldn't load staff accounts."));
  }

  useEffect(load, []);
  useEffect(() => {
    apiClient.get<string[]>("/api/v1/admin/staff/roles").then((res) => {
      setRoles(res.data);
      setInviteRole(res.data[0] ?? "");
    });
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setError(null);
    try {
      const res = await apiClient.post("/api/v1/admin/staff", { email: inviteEmail, roleName: inviteRole });
      setInvited({ email: res.data.email, temporaryPassword: res.data.temporaryPassword });
      setInviteEmail("");
      setShowInvite(false);
      load();
    } catch (err: any) {
      setError(err?.response?.status === 409 ? "That email is already a staff account." : "Couldn't invite that staff member.");
    } finally {
      setInviting(false);
    }
  }

  async function changeRole(row: StaffRow, roleName: string) {
    setBusyId(row.id);
    setError(null);
    try {
      await apiClient.put(`/api/v1/admin/staff/${row.id}/role`, { roleName });
      load();
    } catch {
      setError("Couldn't change that staff member's role.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleStatus(row: StaffRow) {
    const nextStatus = row.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setBusyId(row.id);
    setError(null);
    try {
      await apiClient.put(`/api/v1/admin/staff/${row.id}/status`, { status: nextStatus });
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Couldn't change that staff member's status.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div style={pageHeader}>
        <div>
          <h1 style={h1}>Staff & roles</h1>
          <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Super Admin only. Every change is written to the audit log.</p>
        </div>
        <button onClick={() => setShowInvite((v) => !v)} style={button.accent}>
          {showInvite ? "Cancel" : "+ Invite staff"}
        </button>
      </div>

      {invited && (
        <div style={{ ...card, padding: 16, marginBottom: 16, borderColor: colors.pastelPurpleStrong, background: colors.pastelPurple }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: colors.textOnPurple, margin: 0 }}>
            Invited {invited.email} — share this temporary password with them now, it won't be shown again:
          </p>
          <p style={{ fontFamily: "monospace", fontSize: 14, background: colors.surface, borderRadius: 6, padding: "6px 10px", display: "inline-block", marginTop: 8 }}>
            {invited.temporaryPassword}
          </p>
          <div>
            <button onClick={() => setInvited(null)} style={{ ...button.ghost, marginTop: 4 }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showInvite && (
        <form onSubmit={handleInvite} style={{ ...card, display: "flex", gap: 10, alignItems: "flex-end", padding: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <label style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>
            <span style={{ display: "block", marginBottom: 4 }}>Work email</span>
            <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} style={{ ...input, width: 220 }} />
          </label>
          <label style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>
            <span style={{ display: "block", marginBottom: 4 }}>Role</span>
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ ...input, width: 160, height: 34 }}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={inviting} style={{ ...button.primary, height: 34 }}>
            {inviting ? "Inviting…" : "Invite"}
          </button>
        </form>
      )}

      {error && (
        <div style={{ ...card, padding: "10px 14px", borderColor: "#EAC7C7", marginBottom: 12 }}>
          <p style={{ fontSize: 12.5, color: colors.danger, margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={table.wrap}>
        <table style={table.el}>
          <thead>
            <tr style={table.theadRow}>
              <th style={table.th}>Email</th>
              <th style={table.th}>Role</th>
              <th style={table.th}>MFA</th>
              <th style={table.th}>Status</th>
              <th style={table.th}></th>
            </tr>
          </thead>
          <tbody>
            {staff?.map((s) => {
              const isSelf = s.email === profile?.email;
              return (
                <tr key={s.id}>
                  <td style={{ ...table.td, fontWeight: 600, color: colors.textPrimary }}>
                    {s.email}
                    {isSelf && <span style={{ ...badge(colors.pastelBlue, colors.textOnBlue), marginLeft: 8 }}>you</span>}
                  </td>
                  <td style={table.td}>
                    <select value={s.role} disabled={busyId === s.id} onChange={(e) => changeRole(s, e.target.value)} style={{ ...input, width: 150 }}>
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={table.td}>
                    <span style={badge(s.mfaEnabled ? "#DCEFD3" : "#F1F1EE", s.mfaEnabled ? colors.success : colors.textMuted)}>{s.mfaEnabled ? "Enabled" : "Off"}</span>
                  </td>
                  <td style={table.td}>
                    <span style={badge(s.status === "ACTIVE" ? "#DCEFD3" : "#F4C0D1", s.status === "ACTIVE" ? colors.success : colors.textOnPink)}>{s.status}</span>
                  </td>
                  <td style={table.td}>
                    {!isSelf && (
                      <button onClick={() => toggleStatus(s)} disabled={busyId === s.id} style={button.ghost}>
                        {busyId === s.id ? "…" : s.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {staff?.length === 0 && <p style={{ fontSize: 12.5, color: colors.textMuted, padding: 16 }}>No staff accounts yet.</p>}
        {staff === null && !error && <p style={{ fontSize: 12.5, color: colors.textMuted, padding: 16 }}>Loading…</p>}
      </div>
    </div>
  );
}
