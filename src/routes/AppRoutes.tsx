import React from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CataloguePage } from "@/pages/CataloguePage";
import { OrdersPage } from "@/pages/OrdersPage";
import { StaffPage } from "@/pages/StaffPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { colors } from "@/theme/colors";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "28px 36px", maxWidth: 1200 }}>{children}</main>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/catalogue" element={<ProtectedRoute need="CATALOGUE_VIEW"><AdminLayout><CataloguePage /></AdminLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute need="ORDER_VIEW"><AdminLayout><OrdersPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute need="STAFF_MANAGE"><AdminLayout><StaffPage /></AdminLayout></ProtectedRoute>} />
    </Routes>
  );
}
