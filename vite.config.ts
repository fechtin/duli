/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@data": fileURLToPath(new URL("./data", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Proxy the API to the local Cloudflare Worker (wrangler dev) when running both.
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
  },
  build: {
    target: "es2022",
    cssTarget: "chrome111",
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep the map engine + projection math out of the initial bundle.
          map: ["d3-geo"],
          motion: ["motion"],
        },
      },
    },
  },
});
