import React, { useEffect, useState } from "react";
import { colors } from "@/theme/colors";
import { PermissionGate } from "@/components/PermissionGate";
import { apiClient } from "@/api/client";
import { useAuth } from "@/auth/AuthContext";
import { badge, button, card, h1, pageHeader, table } from "@/theme/ui";

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
    const amount = window.prompt(`Refund amount in cents for order ${order.id.slice(0, 8)}?`, String(order.totalCents));
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
      <div style={pageHeader}>
        <div>
          <h1 style={h1}>Orders</h1>
          <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Customer orders and refunds.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <PermissionGate need="ORDER_REFUND">
            <span style={badge(colors.pastelPink, colors.textOnPink)}>Full refund authority</span>
          </PermissionGate>
          <PermissionGate need="ORDER_REFUND_LIMITED">
            <span style={badge(colors.pastelPink, colors.textOnPink)}>Limited refund authority</span>
          </PermissionGate>
        </div>
      </div>

      {error && (
        <div style={{ ...card, padding: "10px 14px", borderColor: "#EAC7C7", marginBottom: 12 }}>
          <p style={{ fontSize: 12.5, color: colors.danger, margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={table.wrap}>
        <table style={table.el}>
          <thead>
            <tr style={table.theadRow}>
              <th style={table.th}>Order</th>
              <th style={table.th}>Customer</th>
              <th style={table.th}>Status</th>
              <th style={table.th}>Total</th>
              <th style={table.th}>Placed</th>
              {canRefund && <th style={table.th}></th>}
            </tr>
          </thead>
          <tbody>
            {orders?.map((o) => (
              <tr key={o.id}>
                <td style={{ ...table.td, fontFamily: "monospace", fontSize: 12 }}>{o.id.slice(0, 8)}</td>
                <td style={table.td}>{o.customerName ?? o.customerPhone ?? "—"}</td>
                <td style={table.td}>
                  <span style={badge(...statusColors(o.status))}>{o.status}</span>
                </td>
                <td style={{ ...table.td, fontWeight: 600 }}>S$ {(o.totalCents / 100).toFixed(2)}</td>
                <td style={table.td}>{new Date(o.createdAt).toLocaleString()}</td>
                {canRefund && (
                  <td style={table.td}>
                    {o.status !== "REFUNDED" && (
                      <button onClick={() => handleRefund(o)} disabled={refundingId === o.id} style={button.ghost}>
                        {refundingId === o.id ? "Refunding…" : "Refund"}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {orders?.length === 0 && <p style={{ fontSize: 12.5, color: colors.textMuted, padding: 16 }}>No orders yet.</p>}
        {orders === null && !error && <p style={{ fontSize: 12.5, color: colors.textMuted, padding: 16 }}>Loading…</p>}
      </div>
    </div>
  );
}

function statusColors(status: string): [string, string] {
  switch (status) {
    case "PAID":
    case "FULFILLED":
      return ["#DCEFD3", colors.success];
    case "REFUNDED":
    case "CANCELLED":
      return ["#F4C0D1", colors.textOnPink];
    default:
      return [colors.pastelPurple, colors.textOnPurple];
  }
}
