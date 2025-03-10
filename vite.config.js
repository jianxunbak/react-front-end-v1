import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: import.meta.env.VITE_PORT
      ? parseInt(import.meta.env.VITE_PORT)
      : 3000, // Check if VITE_PORT is defined, otherwise default to 3000
  },
});
