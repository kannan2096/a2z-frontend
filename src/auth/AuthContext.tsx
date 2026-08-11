import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import type { StaffProfile, Permission } from "@/types/rbac";

type AuthState = {
  profile: StaffProfile | null;
  loading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<void>;
  logout: () => void;
  hasPermission: (p: Permission) => boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

// Loads the staff member's role + permission set from /me after login.
// The UI only ever uses this to hide/disable actions — the real security
// boundary is always the backend's @PreAuthorize checks (architecture doc
// section 6.4). Never assume hasPermission() here is sufficient on its own.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("a2z_staff_access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    apiClient
      .get<StaffProfile>("/api/v1/admin/me")
      .then((res) => setProfile(res.data))
      .catch(() => localStorage.removeItem("a2z_staff_access_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string, mfaCode?: string) {
    const res = await apiClient.post("/api/v1/auth/staff/login", { email, password, mfaCode });
    localStorage.setItem("a2z_staff_access_token", res.data.accessToken);
    const me = await apiClient.get<StaffProfile>("/api/v1/admin/me");
    setProfile(me.data);
  }

  function logout() {
    localStorage.removeItem("a2z_staff_access_token");
    setProfile(null);
  }

  function hasPermission(p: Permission) {
    return profile?.permissions.includes(p) ?? false;
  }

  return (
    <AuthContext.Provider value={{ profile, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
