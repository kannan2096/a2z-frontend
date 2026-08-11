# a2z-frontend — A2Z Mochi Paradise Admin Console (GUI)

Browser-based back-office tool for internal staff (Chrome/Edge, no install).
Separate codebase from a2z-mobileapp — see architecture doc section 6 for why.

## Structure
```
src/
  auth/AuthContext.tsx     staff login (email+password+MFA), /me profile, permission checks
  routes/                  ProtectedRoute (auth + permission guard), AppRoutes
  components/Sidebar.tsx   role-aware nav — items only show if the staff member has the permission
  components/PermissionGate.tsx   hides UI the caller can't act on (UX only, not the real gate)
  pages/                   Login, Dashboard, Catalogue, Orders, Staff (all placeholder content)
  api/client.ts            axios instance, JWT bearer auth, 401 -> redirect to /login
  types/rbac.ts            Role/Permission types — keep in sync with a2z-backend's permissions table
```

## Getting started
```
npm install
cp .env.example .env     # point VITE_API_BASE_URL at your local/dev API
npm run dev
```

## RBAC model
Four roles — Super Admin, Admin, Manager, Support Staff — see the permission
matrix in `A2Z_Mochi_Paradise_Architecture_Project_Plan.docx` section 6.3.
The frontend only uses permissions to hide/disable actions for a clean UX;
`a2z-backend` enforces every permission server-side with `@PreAuthorize`, so
this app is never the real security boundary.

## Deploys to
Static SPA build (`npm run build` -> `dist/`) hosted on S3 behind CloudFront
at admin.a2zmochiparadise.sg — see architecture doc section 11.
