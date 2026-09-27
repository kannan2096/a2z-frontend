import React, { useEffect, useState } from "react";
import { colors } from "@/theme/colors";
import { PermissionGate } from "@/components/PermissionGate";
import { apiClient } from "@/api/client";

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  currency: string;
  categoryName: string | null;
  stockQuantity: number;
};

type CategoryRow = { id: string; name: string };

const emptyForm = { sku: "", name: "", priceCents: "0", currency: "SGD", initialStock: "0", categoryId: "" };

export function CataloguePage() {
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    setError(null);
    apiClient
      .get<ProductRow[]>("/api/v1/admin/catalogue/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Couldn't load products."));
  }

  useEffect(load, []);
  useEffect(() => {
    apiClient.get<CategoryRow[]>("/api/v1/admin/catalogue/categories").then((res) => setCategories(res.data));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post("/api/v1/admin/catalogue/products", {
        sku: form.sku,
        name: form.name,
        priceCents: Number(form.priceCents),
        currency: form.currency,
        initialStock: Number(form.initialStock),
        categoryId: form.categoryId || null,
      });
      setForm(emptyForm);
      setShowAdd(false);
      load();
    } catch {
      setError("Couldn't save the product — check the SKU isn't already taken.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>Catalogue</h1>
        <PermissionGate need="CATALOGUE_WRITE">
          <button
            onClick={() => setShowAdd((v) => !v)}
            style={{ background: "#D4537E", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            {showAdd ? "Cancel" : "Add product"}
          </button>
        </PermissionGate>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 16, padding: 12, background: colors.surface, border: `0.5px solid ${colors.border}`, borderRadius: 8, flexWrap: "wrap" }}>
          <LabeledInput label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} required />
          <LabeledInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <LabeledInput label="Price (cents)" value={form.priceCents} onChange={(v) => setForm({ ...form, priceCents: v })} type="number" />
          <LabeledInput label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} />
          <LabeledInput label="Initial stock" value={form.initialStock} onChange={(v) => setForm({ ...form, initialStock: v })} type="number" />
          <label style={{ fontSize: 11, color: colors.textSecondary }}>
            <span style={{ display: "block", marginBottom: 4 }}>Category</span>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              style={{ padding: "6px 8px", borderRadius: 6, border: `0.5px solid ${colors.border}`, fontSize: 12, width: 160, height: 32 }}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={saving} style={{ background: "#378ADD", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", height: 32 }}>
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      {error && <p style={{ fontSize: 12, color: colors.danger, marginTop: 12 }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", color: colors.textSecondary, fontSize: 11, textTransform: "uppercase" }}>
            <th style={thStyle}>SKU</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p.id} style={{ borderTop: `0.5px solid ${colors.border}` }}>
              <td style={tdStyle}>{p.sku}</td>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>{p.categoryName ?? "—"}</td>
              <td style={tdStyle}>
                {p.currency} {(p.priceCents / 100).toFixed(2)}
              </td>
              <td style={tdStyle}>{p.stockQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {products?.length === 0 && <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>No products yet.</p>}
      {products === null && !error && <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>Loading…</p>}
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label style={{ fontSize: 11, color: colors.textSecondary }}>
      <span style={{ display: "block", marginBottom: 4 }}>{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "6px 8px", borderRadius: 6, border: `0.5px solid ${colors.border}`, fontSize: 12, width: 120 }}
      />
    </label>
  );
}

const thStyle: React.CSSProperties = { padding: "6px 8px" };
const tdStyle: React.CSSProperties = { padding: "8px 8px" };
