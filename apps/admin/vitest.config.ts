import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tanstack/react-query": path.resolve(__dirname, "./node_modules/@tanstack/react-query"),
      "react-router-dom": path.resolve(__dirname, "./node_modules/react-router-dom"),
      "@brassarmada/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
      "@brassarmada/supabase": path.resolve(__dirname, "../../packages/supabase/src/index.ts"),
      "@brassarmada/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
      "@brassarmada/ui/permissions": path.resolve(__dirname, "../../packages/ui/src/permissions.tsx"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});

