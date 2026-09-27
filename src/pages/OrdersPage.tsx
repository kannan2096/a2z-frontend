import React, { useEffect, useState } from "react";
import { colors } from "@/theme/colors";
import { PermissionGate } from "@/components/PermissionGate";
import { apiClient } from "@/api/client";
import { useAuth } from "@/auth/AuthContext";

type OrderRow = {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  status: string;
  totalCents: number;
  createdAt: string;
};

export function OrdersPage() {
  const { hasPermission } = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  function load() {
    setError(null);
    apiClient
      .get<OrderRow[]>("/api/v1/admin/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Couldn't load orders."));
  }

  useEffect(load, []);

  async function handleRefund(order: OrderRow) {
    const amount = window.prompt(`Refund amount in ${"SGD"} cents for order ${order.id.slice(0, 8)}?`, String(order.totalCents));
    if (!amount) return;
    setRefundingId(order.id);
    setError(null);
    try {
      await apiClient.post(`/api/v1/admin/orders/${order.id}/refund`, { amountCents: Number(amount), reason: "Admin console refund" });
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Refund failed — check the amount is within your role's limit.");
    } finally {
      setRefundingId(null);
    }
  }

  const canRefund = hasPermission("ORDER_REFUND") || hasPermission("ORDER_REFUND_LIMITED");

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>Orders</h1>

      <PermissionGate need="ORDER_REFUND">
        <p style={{ fontSize: 12, color: colors.textOnPink, marginTop: 8 }}>Full refund action available to your role.</p>
      </PermissionGate>
      <PermissionGate need="ORDER_REFUND_LIMITED">
        <p style={{ fontSize: 12, color: colors.textOnPink, marginTop: 8 }}>Refunds available up to the configured Support Staff limit.</p>
      </PermissionGate>

      {error && <p style={{ fontSize: 12, color: colors.danger, marginTop: 12 }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", color: colors.textSecondary, fontSize: 11, textTransform: "uppercase" }}>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Placed</th>
            {canRefund && <th style={thStyle}></th>}
          </tr>
        </thead>
        <tbody>
          {orders?.map((o) => (
            <tr key={o.id} style={{ borderTop: `0.5px solid ${colors.border}` }}>
              <td style={tdStyle}>{o.id.slice(0, 8)}</td>
              <td style={tdStyle}>{o.customerName ?? o.customerPhone ?? "—"}</td>
              <td style={tdStyle}>
                <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, background: statusBg(o.status), color: colors.textPrimary }}>{o.status}</span>
              </td>
              <td style={tdStyle}>S$ {(o.totalCents / 100).toFixed(2)}</td>
              <td style={tdStyle}>{new Date(o.createdAt).toLocaleString()}</td>
              {canRefund && (
                <td style={tdStyle}>
                  {o.status !== "REFUNDED" && (
                    <button
                      onClick={() => handleRefund(o)}
                      disabled={refundingId === o.id}
                      style={{ background: "transparent", border: `0.5px solid ${colors.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}
                    >
                      {refundingId === o.id ? "Refunding…" : "Refund"}
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {orders?.length === 0 && <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>No orders yet.</p>}
      {orders === null && !error && <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>Loading…</p>}
    </div>
  );
}

function statusBg(status: string) {
  switch (status) {
    case "PAID":
    case "FULFILLED":
      return "#DCEFD3";
    case "REFUNDED":
    case "CANCELLED":
      return "#F4C0D1";
    default:
      return "#EEEDFE";
  }
}

const thStyle: React.CSSProperties = { padding: "6px 8px" };
const tdStyle: React.CSSProperties = { padding: "8px 8px" };
