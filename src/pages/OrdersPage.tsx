import React from "react";
import { colors } from "@/theme/colors";
import { PermissionGate } from "@/components/PermissionGate";

export function OrdersPage() {
  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>Orders</h1>
      <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>
        Order list + status filters go here, bound to GET /api/v1/admin/orders.
      </p>
      <PermissionGate need="ORDER_REFUND">
        <p style={{ fontSize: 12, color: colors.textOnPink, marginTop: 8 }}>
          Full refund action available to your role.
        </p>
      </PermissionGate>
      <PermissionGate need="ORDER_REFUND_LIMITED">
        <p style={{ fontSize: 12, color: colors.textOnPink, marginTop: 8 }}>
          Refunds available up to the configured Support Staff limit.
        </p>
      </PermissionGate>
    </div>
  );
}
