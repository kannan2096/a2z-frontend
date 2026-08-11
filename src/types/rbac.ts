// Mirrors architecture doc section 6.2/6.3 — keep this list in sync with
// a2z-backend's `permissions` table (V1__init_schema.sql seed data).
export type Role = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "SUPPORT_STAFF";

export type Permission =
  | "CATALOGUE_WRITE"
  | "INVENTORY_WRITE"
  | "ORDER_VIEW"
  | "ORDER_WRITE"
  | "ORDER_REFUND"
  | "ORDER_REFUND_LIMITED"
  | "PROMOTION_WRITE"
  | "REPORTS_VIEW"
  | "STAFF_MANAGE"
  | "SETTINGS_MANAGE"
  | "CUSTOMER_PII_VIEW";

export type StaffProfile = {
  email: string;
  role: Role;
  permissions: Permission[];
};
