import React, { useEffect, useState } from "react";
import { colors } from "@/theme/colors";
import { PermissionGate } from "@/components/PermissionGate";
import { apiClient } from "@/api/client";
import { badge, button, card, h1, input, pageHeader, table } from "@/theme/ui";
import { useAuth } from "@/auth/AuthContext";

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  currency: string;
  categoryId: string | null;
  categoryName: string | null;
  stockQuantity: number;
};

type CategoryRow = { id: string; name: string };

const emptyForm = { sku: "", name: "", priceCents: "0", currency: "SGD", initialStock: "0", categoryId: "" };
const LOW_STOCK_THRESHOLD = 5;

export function CataloguePage() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("CATALOGUE_WRITE");

  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", priceCents: "0", currency: "SGD", categoryId: "", stockQuantity: "0" });
  const [editSaving, setEditSaving] = useState(false);

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
    setError(null);
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

  function startEdit(p: ProductRow) {
    setEditForm({
      name: p.name,
      priceCents: String(p.priceCents),
      currency: p.currency,
      categoryId: p.categoryId ?? "",
      stockQuantity: String(p.stockQuantity),
    });
    setEditingId(p.id);
    setError(null);
  }

  async function saveEdit(productId: string) {
    setEditSaving(true);
    setError(null);
    try {
      await apiClient.put(`/api/v1/admin/catalogue/products/${productId}`, {
        name: editForm.name,
        priceCents: Number(editForm.priceCents),
        currency: editForm.currency,
        categoryId: editForm.categoryId || null,
        stockQuantity: Number(editForm.stockQuantity),
      });
      setEditingId(null);
      load();
    } catch {
      setError("Couldn't save changes to that product.");
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div>
      <div style={pageHeader}>
        <div>
          <h1 style={h1}>Catalogue</h1>
          <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Products, pricing, and stock levels.</p>
        </div>
        <PermissionGate need="CATALOGUE_WRITE">
          <button onClick={() => setShowAdd((v) => !v)} style={button.accent}>
            {showAdd ? "Cancel" : "+ Add product"}
          </button>
        </PermissionGate>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ ...card, display: "flex", gap: 10, alignItems: "flex-end", padding: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <LabeledInput label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} required />
          <LabeledInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <LabeledInput label="Price (cents)" value={form.priceCents} onChange={(v) => setForm({ ...form, priceCents: v })} type="number" />
          <LabeledInput label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} />
          <LabeledInput label="Initial stock" value={form.initialStock} onChange={(v) => setForm({ ...form, initialStock: v })} type="number" />
          <LabeledSelect label="Category" value={form.categoryId} onChange={(v) => setForm({ ...form, categoryId: v })} categories={categories} />
          <button type="submit" disabled={saving} style={{ ...button.primary, height: 34 }}>
            {saving ? "Saving..." : "Save"}
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
              <th style={table.th}>SKU</th>
              <th style={table.th}>Name</th>
              <th style={table.th}>Category</th>
              <th style={table.th}>Price</th>
              <th style={table.th}>Stock</th>
              {canWrite && <th style={table.th}></th>}
            </tr>
          </thead>
          <tbody>
            {products?.map((p) =>
              editingId === p.id ? (
                <tr key={p.id} style={{ background: "#FCFBF6" }}>
                  <td style={table.td}>{p.sku}</td>
                  <td style={table.td}>
                    <input style={{ ...input, width: 140 }} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </td>
                  <td style={table.td}>
                    <select style={{ ...input, width: 140 }} value={editForm.categoryId} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}>
                      <option value="">— None —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={table.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input style={{ ...input, width: 70 }} value={editForm.currency} onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })} />
                      <input type="number" style={{ ...input, width: 90 }} value={editForm.priceCents} onChange={(e) => setEditForm({ ...editForm, priceCents: e.target.value })} />
                    </div>
                  </td>
                  <td style={table.td}>
                    <input type="number" style={{ ...input, width: 70 }} value={editForm.stockQuantity} onChange={(e) => setEditForm({ ...editForm, stockQuantity: e.target.value })} />
                  </td>
                  <td style={table.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => saveEdit(p.id)} disabled={editSaving} style={button.primary}>
                        {editSaving ? "Saving…" : "Save"}
                      </button>
                      <button onClick={() => setEditingId(null)} style={button.ghost}>
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td style={table.td}>{p.sku}</td>
                  <td style={{ ...table.td, fontWeight: 600, color: colors.textPrimary }}>{p.name}</td>
                  <td style={table.td}>
                    {p.categoryName ? <span style={badge(colors.pastelPurple, colors.textOnPurple)}>{p.categoryName}</span> : <span style={{ color: colors.textMuted }}>—</span>}
                  </td>
                  <td style={table.td}>
                    {p.currency} {(p.priceCents / 100).toFixed(2)}
                  </td>
                  <td style={table.td}>
                    {p.stockQuantity <= LOW_STOCK_THRESHOLD ? <span style={badge("#F9D9DE", colors.danger)}>{p.stockQuantity} left</span> : p.stockQuantity}
                  </td>
                  {canWrite && (
                    <td style={table.td}>
                      <button onClick={() => startEdit(p)} style={button.ghost}>
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>

        {products?.length === 0 && <p style={{ fontSize: 12.5, color: colors.textMuted, padding: 16 }}>No products yet.</p>}
        {products === null && !error && <p style={{ fontSize: 12.5, color: colors.textMuted, padding: 16 }}>Loading…</p>}
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>
      <span style={{ display: "block", marginBottom: 4 }}>{label}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} style={{ ...input, width: 120 }} />
    </label>
  );
}

function LabeledSelect({ label, value, onChange, categories }: { label: string; value: string; onChange: (v: string) => void; categories: CategoryRow[] }) {
  return (
    <label style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>
      <span style={{ display: "block", marginBottom: 4 }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...input, width: 160, height: 34 }}>
        <option value="">— None —</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
