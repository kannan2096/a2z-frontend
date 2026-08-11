import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds to a static SPA bundle deployed to S3 + CloudFront at
// admin.a2zmochiparadise.sg — see architecture doc section 11.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
