import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: import.meta.env.VITE_PORT || 3000, // Fallback to 3000 for local development
  },
});
