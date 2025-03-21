import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 10000,
    host: "0.0.0.0", // Bind to all network interfaces
    open: true,
  },
  build: {
    outDir: "dist",
  },
  preview: {
    allowedHosts: ["react-front-end-v1.onrender.com"],
  },
});
