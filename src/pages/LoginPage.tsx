import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { colors } from "@/theme/colors";

// Staff login: email + password + TOTP MFA code — a separate flow from the
// customer app's phone-OTP login (architecture doc section 6.1).
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password, mfaCode || undefined);
      navigate("/");
    } catch {
      setError("That email, password, or code didn't work. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.pastelBlue }}>
      <form onSubmit={handleSubmit} style={{ background: colors.surface, borderRadius: 12, padding: 28, width: 320, border: `0.5px solid ${colors.border}` }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: colors.textOnBlue, marginBottom: 4 }}>Mochi Admin</h1>
        <p style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 20 }}>Sign in with your staff account</p>

        <Field label="Work email">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@a2zmochiparadise.sg" style={inputStyle} />
        </Field>
        <Field label="Password">
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="MFA code">
          <input type="text" inputMode="numeric" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} placeholder="6-digit code" style={inputStyle} />
        </Field>

        {error && <p style={{ fontSize: 12, color: colors.danger, marginBottom: 10 }}>{error}</p>}

        <button type="submit" disabled={submitting} style={{ width: "100%", background: "#378ADD", color: "#fff", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 600, marginTop: 6, cursor: "pointer" }}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  borderRadius: 8,
  border: `0.5px solid ${colors.border}`,
  fontSize: 13,
};
