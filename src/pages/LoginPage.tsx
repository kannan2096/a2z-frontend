import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { colors } from "@/theme/colors";
import { shadow, radius, button, input as inputStyleBase } from "@/theme/ui";
import { CapybaraMark } from "@/components/CapybaraMark";

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 20% 20%, ${colors.pastelBlue}, transparent 55%), radial-gradient(circle at 85% 80%, ${colors.pastelPink}, transparent 55%), ${colors.bg}`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: colors.surface,
          borderRadius: radius.lg,
          padding: "36px 32px",
          width: 340,
          boxShadow: shadow.lg,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 22 }}>
          <div style={{ background: colors.pastelPurple, borderRadius: "50%", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: shadow.sm }}>
            <CapybaraMark size={40} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.textOnBlue }}>Mochi Admin</h1>
          <p style={{ fontSize: 12.5, color: colors.textSecondary, marginTop: 4 }}>Sign in with your staff account</p>
        </div>

        <Field label="Work email">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@a2zmochiparadise.sg" style={inputStyleBase} />
        </Field>
        <Field label="Password">
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyleBase} />
        </Field>
        <Field label="MFA code">
          <input type="text" inputMode="numeric" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} placeholder="6-digit code (if enabled)" style={inputStyleBase} />
        </Field>

        {error && (
          <div style={{ background: "#FBEAEA", border: "1px solid #EAC7C7", borderRadius: radius.sm, padding: "8px 10px", marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: colors.danger, margin: 0 }}>{error}</p>
          </div>
        )}

        <button type="submit" disabled={submitting} style={{ ...button.primary, width: "100%", padding: 11, fontSize: 13.5, opacity: submitting ? 0.7 : 1 }}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 11.5, color: colors.textSecondary, marginBottom: 5, fontWeight: 500 }}>{label}</span>
      {React.cloneElement(children as React.ReactElement, { style: { ...(children as React.ReactElement).props.style, width: "100%" } })}
    </label>
  );
}
