import React from "react";
import { colors } from "@/theme/colors";
import { PermissionGate } from "@/components/PermissionGate";

// TODO: replace with @tanstack/react-table bound to GET /api/v1/admin/catalogue/products
export function CataloguePage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>Catalogue</h1>
        <PermissionGate need="CATALOGUE_WRITE">
          <button style={{ background: "#D4537E", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600 }}>
            Add product
          </button>
        </PermissionGate>
      </div>
      <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>
        Product table goes here (name, SKU, price, stock, category). Manager, Admin, and Super Admin
        can create/edit; Support Staff can view only (per the permission matrix).
      </p>
    </div>
  );
}
