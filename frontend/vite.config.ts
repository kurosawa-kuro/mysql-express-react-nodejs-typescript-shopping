import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const FRONTEND_PORT = 3000;
const BACKEND_PORT = 8080;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: FRONTEND_PORT,
    proxy: {
      "/api": {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
});
