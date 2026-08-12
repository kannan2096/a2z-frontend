import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Builds to a static SPA bundle deployed to S3 + CloudFront at
// admin.a2zmochiparadise.sg — see architecture doc section 11.
//
// The "@/*" -> "src/*" alias in tsconfig.json only affects the TypeScript
// type-checker (tsc -b) — Vite/Rollup do their own module resolution and
// need the same alias declared here too, or "@/App"-style imports resolve
// fine for `tsc` but fail at bundle time with "Rollup failed to resolve".
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: { port: 5173 },
});
