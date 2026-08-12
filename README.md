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

## Deploying to the same EC2 instance as a2z-backend (fast path)
For now, this runs as a 4th Docker container (nginx serving the built SPA)
on the same Ubuntu instance already running postgres/redis/api, on port 8081.

1. SSH into the instance (same one a2z-backend is on).
2. `scp -i your-key.pem -r a2z-frontend ubuntu@<EC2_PUBLIC_IP>:~` — or clone
   directly on the instance if the repo's pushed.
3. `cd a2z-frontend && chmod +x deploy/ec2-bootstrap.sh`
4. `./deploy/ec2-bootstrap.sh http://<EC2_PUBLIC_IP>:8080` (point it at
   wherever a2z-backend is actually reachable — same instance's public IP,
   port 8080).
5. Open port **8081** in the EC2 security group.
6. Visit `http://<EC2_PUBLIC_IP>:8081`.

Note: `VITE_API_BASE_URL` is baked into the JS bundle at *build* time (Vite
inlines env vars), not read at runtime — changing it later means rebuilding:
`sudo docker compose up -d --build`.

Login won't work end-to-end yet: `a2z-backend`'s staff auth
(`AuthController.staffLogin`) is still a stub, and no `staff_accounts` rows
exist. That's the next piece of backend work needed to make this usable.

## Deploys to (production target)
Static SPA build (`npm run build` -> `dist/`) hosted on S3 behind CloudFront
at admin.a2zmochiparadise.sg — see architecture doc section 11. The EC2
container above is a stepping stone until a real domain + ACM cert are set up.
